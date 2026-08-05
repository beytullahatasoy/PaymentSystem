using Microsoft.EntityFrameworkCore;
using PaymentSystem.Application.Interfaces.Repositories;
using PaymentSystem.Domain.Entities;
using PaymentSystem.Infrastructure.Data;

namespace PaymentSystem.Infrastructure.Repositories;

public class DashboardRepository
    : IDashboardRepository
{
    private readonly PaymentDbContext _dbContext;

    public DashboardRepository(
        PaymentDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    public async Task<int> CountCustomersAsync()
    {
        return await _dbContext.Customers
            .AsNoTracking()
            .CountAsync();
    }

    public async Task<int> CountBankAccountsAsync()
    {
        return await _dbContext.BankAccounts
            .AsNoTracking()
            .CountAsync();
    }

    public async Task<int> CountActiveCardsAsync()
    {
        return await _dbContext.Cards
            .AsNoTracking()
            .CountAsync(card =>
                card.Status == "Active");
    }

    public async Task<int> CountMerchantsAsync()
    {
        return await _dbContext.Merchants
            .AsNoTracking()
            .CountAsync();
    }

    public async Task<int> CountTransactionsAsync()
    {
        return await _dbContext
            .PaymentTransactions
            .AsNoTracking()
            .CountAsync();
    }

    public async Task<int>
        CountTransactionsByStatusAsync(
            string status)
    {
        return await _dbContext
            .PaymentTransactions
            .AsNoTracking()
            .CountAsync(transaction =>
                transaction.Status == status);
    }

    public async Task<List<PaymentTransaction>>
        GetRecentTransactionsAsync(int count)
    {
        return await _dbContext
            .PaymentTransactions
            .AsNoTracking()
            .Include(transaction =>
                transaction.Card)
            .Include(transaction =>
                transaction.Merchant)
            .OrderByDescending(transaction =>
                transaction.CreatedAt)
            .Take(count)
            .ToListAsync();
    }
}