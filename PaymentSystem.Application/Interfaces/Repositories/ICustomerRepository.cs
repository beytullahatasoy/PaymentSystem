using PaymentSystem.Domain.Entities;

namespace PaymentSystem.Application.Interfaces.Repositories;

public interface ICustomerRepository
{
    Task<Customer?> GetByIdAsync(int customerId);
    Task<bool> EmailExistsAsync(string email); // email kayıtlı mı?
    Task AddAsync(Customer customer); // Yeni müşteriyi ekle
    Task SaveChangesAsync(); // Değişiklikleri kaydet
}
