export interface DashboardStats {
  volumeOverTime: { day: string; count: number; total: string }[];
  statusDistribution: { status: string; count: number }[];
  revenueByCurrency: { currency: string; total: string; count: number }[];
  fraudStats: { flagged: number; clean: number }[];
  kpi: {
    total_transactions: number;
    successful: number;
    failed: number;
    total_revenue: string;
  }[];
}

export interface Transaction {
  id: string;
  externalId: string | null;
  amount: string;
  currency: string;
  status: string;
  createdDate: string;
  integration?: {
    id: string;
    isEnabled: boolean;
    company?: { name: string };
    provider?: { name: string };
  };
}

export interface Company {
  id: string;
  name: string;
  apiKeyHash: string;
  createdDate: string;
}

export interface User {
  id: string;
  email: string;
  role: string;
  lastLoginDate: string | null;
  company?: { name: string };
}

export interface Integration {
  id: string;
  credentials: Record<string, any>;
  isEnabled: boolean;
  company?: { name: string };
  provider?: { name: string };
}

export interface FraudCheck {
  id: string;
  score: number;
  isFlagged: boolean;
  checkDate: string;
  transaction?: { id: string; amount: string; currency: string; status: string };
  rule?: { name: string; threshold: string };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  companyId: string;
}
