using Microsoft.EntityFrameworkCore;
using PaymentSystem.Application.Interfaces.Repositories;
using PaymentSystem.Domain.Entities;
using PaymentSystem.Infrastructure.Data;

namespace PaymentSystem.Infrastructure.Repositories;

public class CardRepository : ICardRepository
{
    private readonly PaymentDbContext _dbContext;


    public CardRepository(PaymentDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<bool> CardTokenExistsAsync(string cardToken)
    {
        return await _dbContext.Cards
            .AnyAsync(card => card.CardToken == cardToken);
    }

    public async Task<Card?> GetByTokenAsync(string cardToken)
    {
        return await _dbContext.Cards
            .Include(card => card.BankAccount)
            .FirstOrDefaultAsync(card =>
                card.CardToken == cardToken);
    }

    public async Task AddAsync(Card card)
    {
        await _dbContext.Cards.AddAsync(card);
    }

    public async Task SaveChangesAsync()
    {
        await _dbContext.SaveChangesAsync();
    }

    public async Task<List<Card>> GetByBankAccountIdAsync(
    int bankAccountId)
    {
        return await _dbContext.Cards
            .AsNoTracking()
            .Where(card => card.BankAccountId == bankAccountId)
            .OrderBy(card => card.CardId)
            .ToListAsync();
    }
}