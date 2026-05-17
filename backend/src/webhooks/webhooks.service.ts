import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { Integrations } from '../entities/Integrations';
import { Transactions } from '../entities/Transactions';
import { RawLogs } from '../entities/RawLogs';
import { FraudChecks } from '../entities/FraudChecks';
import { FraudRules } from '../entities/FraudRules';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(
    @InjectRepository(Integrations) private integrationsRepo: Repository<Integrations>,
    @InjectRepository(Transactions) private transactionsRepo: Repository<Transactions>,
    @InjectRepository(RawLogs) private rawLogsRepo: Repository<RawLogs>,
    @InjectRepository(FraudChecks) private fraudChecksRepo: Repository<FraudChecks>,
    @InjectRepository(FraudRules) private fraudRulesRepo: Repository<FraudRules>,
  ) {}

  async handleWebhook(
    integrationId: string,
    signature: string | undefined,
    payload: Record<string, any>,
  ) {
    const integration = await this.integrationsRepo.findOne({
      where: { id: integrationId },
      relations: ['company', 'provider'],
    });
    if (!integration) throw new NotFoundException('Integration not found');

    this.verifySignature(payload, signature, integration.company.apiKeyHash);

    await this.rawLogsRepo.save(
      this.rawLogsRepo.create({ payload }),
    );

    const externalId: string | undefined =
      payload.id ?? payload.transaction_id ?? payload.paymentId;

    if (!externalId) {
      this.logger.warn(`Webhook for integration ${integrationId}: no external_id in payload`);
      return { received: true, updated: false };
    }

    const transaction = await this.transactionsRepo.findOne({ where: { externalId } });
    if (!transaction) {
      this.logger.warn(`Webhook: transaction with externalId=${externalId} not found`);
      return { received: true, updated: false };
    }

    const newStatus: string =
      payload.status ?? payload.state ?? payload.outcome ?? transaction.status;

    await this.transactionsRepo.update(transaction.id, { status: newStatus });
    transaction.status = newStatus;

    const rules = await this.fraudRulesRepo.find();
    await Promise.all(rules.map((rule) => this.runFraudCheck(transaction, rule)));

    this.logger.log(
      `Webhook processed: integration=${integrationId} externalId=${externalId} status=${newStatus}`,
    );

    return { received: true, updated: true, transactionId: transaction.id, status: newStatus };
  }

  private verifySignature(
    payload: Record<string, any>,
    signature: string | undefined,
    secret: string,
  ) {
    if (!signature) throw new UnauthorizedException('Missing X-Webhook-Signature header');

    const expected = 'sha256=' + crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(payload))
      .digest('hex');

    const sigBuffer = Buffer.from(signature);
    const expBuffer = Buffer.from(expected);

    if (
      sigBuffer.length !== expBuffer.length ||
      !crypto.timingSafeEqual(sigBuffer, expBuffer)
    ) {
      throw new UnauthorizedException('Invalid webhook signature');
    }
  }

  private async runFraudCheck(transaction: Transactions, rule: FraudRules) {
    const threshold = parseFloat(rule.threshold);
    let score: number;

    if (rule.name === 'High amount threshold') {
      // Score is ratio of amount to threshold (capped at 1)
      score = Math.min(parseFloat(transaction.amount) / threshold, 1);
    } else {
      // Deterministic pseudo-score based on transaction + rule ids
      const hash = crypto
        .createHash('sha256')
        .update(`${transaction.id}:${rule.id}`)
        .digest('hex');
      score = parseInt(hash.slice(0, 8), 16) / 0xffffffff;
    }

    await this.fraudChecksRepo.save(
      this.fraudChecksRepo.create({
        transaction,
        rule,
        score,
        isFlagged: score > threshold,
        checkDate: new Date(),
      }),
    );
  }
}
