using PaymentSystem.Domain.Entities;

namespace PaymentSystem.Application.Interfaces.Repositories;

public interface IPaymentTransactionRepository
{
    Task<bool> TransactionReferenceExistsAsync(
        string transactionReference);

    Task<long> GetApprovedAmountForCardAsync(
        int cardId,
        DateTime startDateUtc,
        DateTime endDateUtc);

    Task AddAsync(PaymentTransaction paymentTransaction);
    Task SaveChangesAsync();
}
