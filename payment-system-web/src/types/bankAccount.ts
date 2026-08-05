export interface BankAccount {
    bankAccountId: number;
    customerId: number;
    accountNumber: string;
    balanceMinor: number;
    currency: string;
    status: string;
    createdAt: string;
}

export interface CreateBankAccountRequest {
    customerId: number;
    currency: string;
}

export interface DepositBankAccountRequest {
    amountMinor: number;
}