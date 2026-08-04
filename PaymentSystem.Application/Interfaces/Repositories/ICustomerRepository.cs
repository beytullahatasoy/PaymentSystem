using PaymentSystem.Domain.Entities;

namespace PaymentSystem.Application.Interfaces.Repositories;

public interface ICustomerRepository
{
    Task<List<Customer>> GetAllAsync();
    Task<Customer?> GetByIdAsync(int customerId);
    Task<bool> EmailExistsAsync(string email); 
    Task AddAsync(Customer customer); 
    Task SaveChangesAsync(); 
}
