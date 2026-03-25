export interface User {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  nationality: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  kycStatus: 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  kycDocumentUrl?: string;
  createdAt: string;
}

export interface Wallet {
  id: string;
  userId: string;
  currency: string;
  balance: string | number;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'SWAP' | 'FEE';
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REVERSED';
  fromCurrency?: string;
  toCurrency?: string;
  fromAmount?: string;
  toAmount?: string;
  exchangeRate?: string;
  feeAmount?: string;
  reference: string;
  description?: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  transactions: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ExchangeRate {
  fromCurrency: string;
  toCurrency: string;
  rate: string;
  fetchedAt: string;
}
