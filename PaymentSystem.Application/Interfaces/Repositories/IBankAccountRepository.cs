using PaymentSystem.Domain.Entities;

namespace PaymentSystem.Application.Interfaces.Repositories;

public interface IBankAccountRepository
{
    Task<BankAccount?> GetByIdAsync(int bankAccountId);
    Task<bool> AccountNumberExistsAsync(string accountNumber);
    Task AddAsync(BankAccount bankAccount);
    Task SaveChangesAsync();
}
