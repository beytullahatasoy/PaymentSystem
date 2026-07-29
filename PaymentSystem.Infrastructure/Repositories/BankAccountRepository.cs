using Microsoft.EntityFrameworkCore;
using PaymentSystem.Application.Interfaces.Repositories;
using PaymentSystem.Domain.Entities;
using PaymentSystem.Infrastructure.Data;

namespace PaymentSystem.Infrastructure.Repositories;

public class BankAccountRepository : IBankAccountRepository
{
    private readonly PaymentDbContext _dbContext;

    public BankAccountRepository(PaymentDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<BankAccount?> GetByIdAsync(int bankAccountId)
    {
        return await _dbContext.BankAccounts
            .FirstOrDefaultAsync(bankAccount =>
                bankAccount.BankAccountId == bankAccountId);
    }

    public async Task<bool> AccountNumberExistsAsync(string accountNumber)
    {
        return await _dbContext.BankAccounts
            .AnyAsync(bankAccount => 
            bankAccount.AccountNumber == accountNumber);

    }
    public async Task AddAsync(BankAccount bankAccount)
    {
        await _dbContext.BankAccounts.AddAsync(bankAccount);
    }
    public async Task SaveChangesAsync()
    {
        await _dbContext.SaveChangesAsync();
    }
}
