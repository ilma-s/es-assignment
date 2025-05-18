export interface Transaction {
  amount: number;
  challenge: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  timestamp: string;
}

export interface MockDatabase {
  transactions: Map<string, Transaction>;
  balances: Map<string, number>;
}

declare global {
  var mockDb: MockDatabase;
} 