using PaymentSystem.Domain.Entities;

namespace PaymentSystem.Application.Interfaces.Repositories;

public interface ICardRepository
{
    Task<List<Card>> GetByBankAccountIdAsync(int bankAccountId);
    Task<Card?> GetByTokenAsync(string cardToken);
    Task<bool> CardTokenExistsAsync(string cardToken);
    Task AddAsync(Card card);
    Task SaveChangesAsync();
}
