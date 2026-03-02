import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

    // 1. Providers
    const providerNames = ['Stripe', 'PayPal', 'Adyen', 'Checkout.com', 'Worldpay'];
    const providers = await Promise.all(
      providerNames.map((name) => this.providersRepo.save(this.providersRepo.create({ name }))),
    );
    this.logger.log(`Created ${providers.length} providers`);

    // 2. Companies
    const companyNames = ['TechCorp', 'ShopOnline', 'GameStudio', 'FinanceHub', 'TravelPro'];
    const companies = await Promise.all(
      companyNames.map((name) =>
        this.companiesRepo.save(
          this.companiesRepo.create({
            name,
            apiKeyHash: `hash_${name.toLowerCase()}_${Math.random().toString(36).slice(2)}`,
          }),
        ),
      ),
    );
    this.logger.log(`Created ${companies.length} companies`);

    // 3. Users
    const roles = ['admin', 'manager', 'viewer'];
    const users: Users[] = [];
    for (const company of companies) {
      for (let i = 0; i < 3; i++) {
        const role = roles[i];
        const user = await this.usersRepo.save(
          this.usersRepo.create({
            email: `${role}@${company.name.toLowerCase().replace(/\s/g, '')}.com`,
            passwordHash: `$2b$10$fake_hash_${Math.random().toString(36).slice(2)}`,
            role,
            lastLoginDate: this.randomDate(30),
            company,
          }),
        );
        users.push(user);
      }
    }
    this.logger.log(`Created ${users.length} users`);

    // 4. Integrations
    const integrations: Integrations[] = [];
    for (const company of companies) {
      const numIntegrations = 1 + Math.floor(Math.random() * 3);
      const shuffled = [...providers].sort(() => Math.random() - 0.5);
      for (let i = 0; i < numIntegrations; i++) {
        const integration = await this.integrationsRepo.save(
          this.integrationsRepo.create({
            company,
            provider: shuffled[i],
            credentials: { apiKey: `sk_test_${Math.random().toString(36).slice(2)}`, mode: 'test' },
            isEnabled: Math.random() > 0.15,
          }),
        );
        integrations.push(integration);
      }
    }
    this.logger.log(`Created ${integrations.length} integrations`);

    // 5. Fraud rules
    const ruleData = [
      { name: 'High amount threshold', threshold: '5000.00' },
      { name: 'Velocity check', threshold: '0.80' },
      { name: 'Country mismatch', threshold: '0.60' },
      { name: 'Card BIN risk', threshold: '0.70' },
      { name: 'Device fingerprint', threshold: '0.75' },
    ];
    const rules = await Promise.all(
      ruleData.map((r) => this.fraudRulesRepo.save(this.fraudRulesRepo.create(r))),
    );
    this.logger.log(`Created ${rules.length} fraud rules`);

    // 6. Transactions (500 over the last 60 days)
    const statuses = ['success', 'failed', 'pending', 'refunded'];
    const currencies = ['USD', 'EUR', 'GBP', 'UAH', 'PLN'];
    const statusWeights = [0.65, 0.15, 0.12, 0.08];
    const transactions: Transactions[] = [];

    for (let i = 0; i < 500; i++) {
      const integration = integrations[Math.floor(Math.random() * integrations.length)];
      const status = this.weightedRandom(statuses, statusWeights);
      const currency = currencies[Math.floor(Math.random() * currencies.length)];
      const amount = (10 + Math.random() * 9990).toFixed(4);

      const tx = await this.transactionsRepo.save(
        this.transactionsRepo.create({
          externalId: `ext_${Math.random().toString(36).slice(2, 10)}`,
          amount,
          currency,
          status,
          createdDate: this.randomDate(60),
          integration,
        }),
      );
      transactions.push(tx);
    }
    this.logger.log(`Created ${transactions.length} transactions`);

    // 7. Fraud checks (~30% of transactions)
    let fraudCheckCount = 0;
    for (const tx of transactions) {
      if (Math.random() > 0.3) continue;
      const rule = rules[Math.floor(Math.random() * rules.length)];
      const score = Math.random();
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

    // 8. Raw logs (one per transaction)
    for (const tx of transactions) {
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
    }
    this.logger.log(`Created ${transactions.length} raw logs`);

    // 9. Audit logs
    let auditCount = 0;
    const actions = [
      'integration.created',
      'integration.updated',
      'user.login',
      'user.password_changed',
      'transaction.refunded',
      'fraud_rule.updated',
    ];
    for (const user of users) {
      const numLogs = 2 + Math.floor(Math.random() * 5);
      for (let i = 0; i < numLogs; i++) {
        await this.auditLogsRepo.save(
          this.auditLogsRepo.create({
            user,
            action: actions[Math.floor(Math.random() * actions.length)],
            oldValues: { status: 'before' },
            newValues: { status: 'after' },
            performedDate: this.randomDate(30),
          }),
        );
        auditCount++;
      }
    }
    this.logger.log(`Created ${auditCount} audit logs`);

    this.logger.log('Seeding complete!');
  }

  private randomDate(daysBack: number): Date {
    const now = Date.now();
    const past = now - daysBack * 24 * 60 * 60 * 1000;
    return new Date(past + Math.random() * (now - past));
  }

  private weightedRandom<T>(items: T[], weights: number[]): T {
    const r = Math.random();
    let sum = 0;
    for (let i = 0; i < items.length; i++) {
      sum += weights[i];
      if (r < sum) return items[i];
    }
    return items[items.length - 1];
  }
}