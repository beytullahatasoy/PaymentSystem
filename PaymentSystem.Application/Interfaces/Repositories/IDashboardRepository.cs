using PaymentSystem.Domain.Entities;

namespace PaymentSystem.Application.Interfaces.Repositories;

public interface IDashboardRepository
{
    Task<int> CountCustomersAsync();
    Task<int> CountBankAccountsAsync();
    Task<int> CountActiveCardsAsync();
    Task<int> CountMerchantsAsync();
    Task<int> CountTransactionsAsync();
    Task<int> CountTransactionsByStatusAsync(
        string status);
    Task<List<PaymentTransaction>>
        GetRecentTransactionsAsync(int count);
}