using PaymentSystem.Domain.Entities;

namespace PaymentSystem.Application.Interfaces.Repositories;

public interface IMerchantRepository
{
    Task<Merchant?> GetByCodeAsync(string merchantCode);
    Task<bool> MerchantCodeExistsAsync(string merchantCode);
    Task AddAsync(Merchant merchant);
    Task SaveChangesAsync();
}