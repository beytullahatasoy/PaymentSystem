using.PaymentSystem.Application.Dtos.Customers;
using PaymentSystem.Domain.Entities;

namespace PaymentSystem.Application.Interfaces.Repositories;

internal interface ICustomerRepository
{
    Task<bool> EmailExistAsync(string email);

    Task AddAsync(Customer customer);

    Task SaveChangesAsync();
}
