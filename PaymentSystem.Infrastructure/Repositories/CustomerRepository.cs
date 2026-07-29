using PaymentSystem.Domain.Entities;
using PaymentSystem.Application.Interfaces.Repositories;
using PaymentSystem.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace PaymentSystem.Infrastructure.Repositories;

public class CustomerRepository : ICustomerRepository
{
    private readonly PaymentDbContext _dbContext;
    public CustomerRepository(PaymentDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Customer?> GetByIdAsync(int customerId)
    {
        return await _dbContext.Customers
            .FirstOrDefaultAsync(customer => 
            customer.CustomerId == customerId);
    }

    public async Task<bool> EmailExistsAsync(string email)
    {
        return await _dbContext.Customers.AnyAsync(customer => customer.Email == email);
    }
    public async Task AddAsync(Customer customer)
    {
        await _dbContext.Customers.AddAsync(customer);
    }

    public async Task SaveChangesAsync()
    {
        await _dbContext.SaveChangesAsync();
    }
}