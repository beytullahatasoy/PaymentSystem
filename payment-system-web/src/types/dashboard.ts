export interface DashboardRecentTransaction {
    paymentTransactionId: number;
    transactionReference: string;
    merchantName: string;
    cardBank: string;
    lastFourDigits: string;
    amountMinor: number;
    currency: string;
    status: string;
    createdAt: string;
}

export interface DashboardSummary {
    totalCustomers: number;
    totalBankAccounts: number;
    activeCards: number;
    totalMerchants: number;
    totalTransactions: number;
    approvedTransactions: number;
    declinedTransactions: number;
    recentTransactions: DashboardRecentTransaction[];
}