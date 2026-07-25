using PaymentSystem.Domain.Entities;

namespace PaymentSystem.Application.Interfaces.Repositories;

public interface ICustomerRepository
{
    Task<bool> EmailExistAsync(string email); // email kayıtlı mı?
    Task AddAsync(Customer customer); // Yeni müşteriyi ekle
    Task SaveChangesAsync(); // Değişiklikleri kaydet
}
