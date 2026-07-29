using Microsoft.EntityFrameworkCore;
using PaymentSystem.Application.Interfaces.Repositories;
using PaymentSystem.Domain.Entities;
using PaymentSystem.Infrastructure.Data;

namespace PaymentSystem.Infrastructure.Repositories;

public class PaymentTransactionRepository
    : IPaymentTransactionRepository
{
    private readonly PaymentDbContext _dbContext;

    public PaymentTransactionRepository(
        PaymentDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<bool> TransactionReferenceExistsAsync(
        string transactionReference)
    {
        return await _dbContext.PaymentTransactions
            .AnyAsync(paymentTransaction =>
                paymentTransaction.TransactionReference ==
                transactionReference);
    }

    public async Task<long> GetApprovedAmountForCardAsync(
        int cardId,
        DateTime startDateUtc,
        DateTime endDateUtc)
    {
        long totalApprovedAmount =
            await _dbContext.PaymentTransactions
                .Where(paymentTransaction =>
                    paymentTransaction.CardId == cardId &&
                    paymentTransaction.Status == "Approved" &&
                    paymentTransaction.CreatedAt >= startDateUtc &&
                    paymentTransaction.CreatedAt < endDateUtc)
                .SumAsync(paymentTransaction =>
                    (long?)paymentTransaction.AmountMinor)
            ?? 0;

        return totalApprovedAmount;
    }

    public async Task AddAsync(
        PaymentTransaction paymentTransaction)
    {
        await _dbContext.PaymentTransactions
            .AddAsync(paymentTransaction);
    }

    public async Task SaveChangesAsync()
    {
        await _dbContext.SaveChangesAsync();
    }
}