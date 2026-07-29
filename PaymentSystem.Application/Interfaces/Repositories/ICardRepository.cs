using PaymentSystem.Domain.Entities;

namespace PaymentSystem.Application.Interfaces.Repositories;

public interface ICardRepository
{
    Task<bool> CardTokenExistsAsync(string cardToken);
    Task AddAsync(Card card);
    Task SaveChangesAsync();
}
