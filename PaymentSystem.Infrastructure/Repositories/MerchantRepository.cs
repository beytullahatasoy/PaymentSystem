using Microsoft.EntityFrameworkCore;
using PaymentSystem.Application.Interfaces.Repositories;
using PaymentSystem.Domain.Entities;
using PaymentSystem.Infrastructure.Data;

namespace PaymentSystem.Infrastructure.Repositories;

public class MerchantRepository : IMerchantRepository
{
    private readonly PaymentDbContext _dbContext;

    public MerchantRepository(PaymentDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<bool> MerchantCodeExistsAsync(
        string merchantCode)
    {
        return await _dbContext.Merchants
            .AnyAsync(merchant =>
                merchant.MerchantCode == merchantCode);
    }

    public async Task AddAsync(Merchant merchant)
    {
        await _dbContext.Merchants.AddAsync(merchant);
    }

    public async Task SaveChangesAsync()
    {
        await _dbContext.SaveChangesAsync();
    }
}