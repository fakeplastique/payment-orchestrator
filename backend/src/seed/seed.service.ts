import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Companies } from '../entities/Companies';
import { Providers } from '../entities/Providers';
import { Users } from '../entities/Users';
import { Integrations } from '../entities/Integrations';
import { Transactions } from '../entities/Transactions';
import { FraudRules } from '../entities/FraudRules';
import { FraudChecks } from '../entities/FraudChecks';
import { RawLogs } from '../entities/RawLogs';
import { AuditLogs } from '../entities/AuditLogs';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Companies) private companiesRepo: Repository<Companies>,
    @InjectRepository(Providers) private providersRepo: Repository<Providers>,
    @InjectRepository(Users) private usersRepo: Repository<Users>,
    @InjectRepository(Integrations) private integrationsRepo: Repository<Integrations>,
    @InjectRepository(Transactions) private transactionsRepo: Repository<Transactions>,
    @InjectRepository(FraudRules) private fraudRulesRepo: Repository<FraudRules>,
    @InjectRepository(FraudChecks) private fraudChecksRepo: Repository<FraudChecks>,
    @InjectRepository(RawLogs) private rawLogsRepo: Repository<RawLogs>,
    @InjectRepository(AuditLogs) private auditLogsRepo: Repository<AuditLogs>,
  ) {}

  async run() {
    this.logger.log('Seeding database...');

    // 1. Providers — find or create by name
    const providerNames = ['Stripe', 'PayPal', 'Adyen', 'Checkout.com', 'Worldpay'];
    const providers = await Promise.all(
      providerNames.map(async (name) => {
        const existing = await this.providersRepo.findOne({ where: { name } });
        return existing ?? (await this.providersRepo.save(this.providersRepo.create({ name })));
      }),
    );
    this.logger.log(`Upserted ${providers.length} providers`);

    // 2. Companies — find or create by name
    const companyNames = ['TechCorp', 'ShopOnline', 'GameStudio', 'FinanceHub', 'TravelPro'];
    const companies = await Promise.all(
      companyNames.map(async (name) => {
        const existing = await this.companiesRepo.findOne({ where: { name } });
        return (
          existing ??
          (await this.companiesRepo.save(
            this.companiesRepo.create({
              name,
              apiKeyHash: `hash_${name.toLowerCase()}_seed`,
            }),
          ))
        );
      }),
    );
    this.logger.log(`Upserted ${companies.length} companies`);

    // 3. Users — find or create by email (password: Password123!)
    const roles = ['admin', 'manager', 'viewer'];
    const passwordHash = await bcrypt.hash('Password123!', 12);
    const users: Users[] = [];
    for (const company of companies) {
      for (let i = 0; i < 3; i++) {
        const role = roles[i];
        const email = `${role}@${company.name.toLowerCase().replace(/\s/g, '')}.com`;
        const existing = await this.usersRepo.findOne({ where: { email } });
        const user =
          existing ??
          (await this.usersRepo.save(
            this.usersRepo.create({
              email,
              passwordHash,
              role,
              lastLoginDate: this.deterministicDate(30, i),
              company,
            }),
          ));
        users.push(user);
      }
    }
    this.logger.log(`Upserted ${users.length} users`);
    this.logger.log('Example: manager@techcorp.com / Password123!');

    // 4. Integrations — find or create by company + provider
    const integrations: Integrations[] = [];
    for (let ci = 0; ci < companies.length; ci++) {
      const company = companies[ci];
      const numIntegrations = 1 + (ci % 3);
      for (let j = 0; j < numIntegrations; j++) {
        const provider = providers[(ci + j) % providers.length];
        const existing = await this.integrationsRepo.findOne({
          where: { company: { id: company.id }, provider: { id: provider.id } },
        });
        const integration =
          existing ??
          (await this.integrationsRepo.save(
            this.integrationsRepo.create({
              company,
              provider,
              credentials: { apiKey: `sk_test_seed_${company.name}_${provider.name}`, mode: 'test' },
              isEnabled: j === 0 ? true : ci % 4 !== 0,
            }),
          ));
        integrations.push(integration);
      }
    }
    this.logger.log(`Upserted ${integrations.length} integrations`);

    // 5. Fraud rules — find or create by name
    const ruleData = [
      { name: 'High amount threshold', threshold: '5000.00' },
      { name: 'Velocity check', threshold: '0.80' },
      { name: 'Country mismatch', threshold: '0.60' },
      { name: 'Card BIN risk', threshold: '0.70' },
      { name: 'Device fingerprint', threshold: '0.75' },
    ];
    const rules = await Promise.all(
      ruleData.map(async (r) => {
        const existing = await this.fraudRulesRepo.findOne({ where: { name: r.name } });
        return existing ?? (await this.fraudRulesRepo.save(this.fraudRulesRepo.create(r)));
      }),
    );
    this.logger.log(`Upserted ${rules.length} fraud rules`);

    // 6. Transactions — find or create by deterministic externalId
    const statuses = ['success', 'failed', 'pending', 'refunded'];
    const currencies = ['USD', 'EUR', 'GBP', 'UAH', 'PLN'];
    const statusWeights = [0.65, 0.15, 0.12, 0.08];
    const transactions: Transactions[] = [];

    for (let i = 0; i < 500; i++) {
      const externalId = `seed_tx_${String(i).padStart(3, '0')}`;
      const existing = await this.transactionsRepo.findOne({ where: { externalId } });
      if (existing) {
        transactions.push(existing);
        continue;
      }
      const integration = integrations[i % integrations.length];
      const status = this.weightedRandom(statuses, statusWeights, i);
      const currency = currencies[i % currencies.length];
      const amount = (10 + ((i * 19.97) % 9990)).toFixed(4);

      const tx = await this.transactionsRepo.save(
        this.transactionsRepo.create({
          externalId,
          amount,
          currency,
          status,
          createdDate: this.deterministicDate(60, i),
          integration,
        }),
      );
      transactions.push(tx);
    }
    this.logger.log(`Upserted ${transactions.length} transactions`);

    // 7. Fraud checks — skip if transaction already has any
    let fraudCheckCount = 0;
    for (let i = 0; i < transactions.length; i++) {
      if (i % 3 !== 0) continue;
      const tx = transactions[i];
      const alreadyExists = await this.fraudChecksRepo.findOne({
        where: { transaction: { id: tx.id } },
      });
      if (alreadyExists) continue;

      const rule = rules[i % rules.length];
      const score = (i * 0.137) % 1;
      const isFlagged = score > parseFloat(rule.threshold);

      await this.fraudChecksRepo.save(
        this.fraudChecksRepo.create({
          transaction: tx,
          rule,
          score,
          isFlagged,
          checkDate: tx.createdDate,
        }),
      );
      fraudCheckCount++;
    }
    this.logger.log(`Created ${fraudCheckCount} fraud checks`);

    // 8. Raw logs — one per transaction, skip if already exists
    let rawLogCount = 0;
    for (const tx of transactions) {
      const alreadyExists = await this.rawLogsRepo.findOne({
        where: { transaction: { id: tx.id } },
      });
      if (alreadyExists) continue;

      await this.rawLogsRepo.save(
        this.rawLogsRepo.create({
          transaction: tx,
          payload: {
            event: 'payment_processed',
            transactionId: tx.id,
            amount: tx.amount,
            currency: tx.currency,
            status: tx.status,
            timestamp: tx.createdDate,
          },
        }),
      );
      rawLogCount++;
    }
    this.logger.log(`Created ${rawLogCount} raw logs`);

    // 9. Audit logs — skip if user already has any
    let auditCount = 0;
    const actions = [
      'integration.created',
      'integration.updated',
      'user.login',
      'user.password_changed',
      'transaction.refunded',
      'fraud_rule.updated',
    ];
    for (let ui = 0; ui < users.length; ui++) {
      const user = users[ui];
      const alreadyExists = await this.auditLogsRepo.findOne({
        where: { user: { id: user.id } },
      });
      if (alreadyExists) continue;

      const numLogs = 2 + (ui % 5);
      for (let i = 0; i < numLogs; i++) {
        await this.auditLogsRepo.save(
          this.auditLogsRepo.create({
            user,
            action: actions[(ui + i) % actions.length],
            oldValues: { status: 'before' },
            newValues: { status: 'after' },
            performedDate: this.deterministicDate(30, ui * 10 + i),
          }),
        );
        auditCount++;
      }
    }
    this.logger.log(`Created ${auditCount} audit logs`);

    this.logger.log('Seeding complete!');
    return { message: 'Seeding complete' };
  }

  private deterministicDate(daysBack: number, index: number): Date {
    const now = Date.now();
    const past = now - daysBack * 24 * 60 * 60 * 1000;
    const fraction = (index * 0.618033988) % 1; // golden ratio spread
    return new Date(past + fraction * (now - past));
  }

  private weightedRandom<T>(items: T[], weights: number[], seed: number): T {
    const r = (seed * 0.618033988) % 1;
    let sum = 0;
    for (let i = 0; i < items.length; i++) {
      sum += weights[i];
      if (r < sum) return items[i];
    }
    return items[items.length - 1];
  }
}
