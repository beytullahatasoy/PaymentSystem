using System.Security.Cryptography;
using PaymentSystem.Application.Dtos.Cards;
using PaymentSystem.Application.Interfaces.Repositories;
using PaymentSystem.Application.Interfaces.Services;
using PaymentSystem.Domain.Entities;

namespace PaymentSystem.Application.Services;

public class CardService : ICardService
{
    private readonly IBankAccountRepository _bankAccountRepository;
    private readonly ICardRepository _cardRepository;

    public CardService(
        IBankAccountRepository bankAccountRepository,
        ICardRepository cardRepository)
    {
        _bankAccountRepository = bankAccountRepository;
        _cardRepository = cardRepository;
    }

    public async Task<CardResponseDto> CreateCardAsync(
        CreateCardDto request)
    {
        BankAccount? bankAccount =
            await _bankAccountRepository.GetByIdAsync(
                request.BankAccountId);

        if (bankAccount is null)
        {
            throw new KeyNotFoundException(
                "Banka hesabı bulunamadı.");
        }

        if (bankAccount.Status != "Active")
        {
            throw new InvalidOperationException(
                "Aktif olmayan bir banka hesabı için kart oluşturulamaz.");
        }

        string normalizedCardBank = request.CardBank.Trim();

        if (string.IsNullOrWhiteSpace(normalizedCardBank))
        {
            throw new ArgumentException(
                "Kartın bağlı olduğu banka adı boş bırakılamaz.");
        }

        string cardToken =
            await GenerateUniqueCardTokenAsync();

        string lastFourDigits =
            GenerateLastFourDigits();

        DateTime expiryDate =
            DateTime.UtcNow.AddYears(5);

        Card card = new()
        {
            BankAccountId = bankAccount.BankAccountId,
            CardToken = cardToken,
            CardBank = normalizedCardBank,
            LastFourDigits = lastFourDigits,
            ExpiryMonth = expiryDate.Month,
            ExpiryYear = expiryDate.Year,
            DailyLimitMinor = request.DailyLimitMinor,
            Status = "Active"
        };

        await _cardRepository.AddAsync(card);

        await _cardRepository.SaveChangesAsync();

        CardResponseDto response = new()
        {
            CardId = card.CardId,
            BankAccountId = card.BankAccountId,
            CardToken = card.CardToken,
            CardBank = card.CardBank,
            LastFourDigits = card.LastFourDigits,
            ExpiryMonth = card.ExpiryMonth,
            ExpiryYear = card.ExpiryYear,
            DailyLimitMinor = card.DailyLimitMinor,
            Status = card.Status,
            CreatedAt = card.CreatedAt
        };

        return response;
    }

    private async Task<string> GenerateUniqueCardTokenAsync()
    {
        string cardToken;
        bool cardTokenExists;

        do
        {
            cardToken =
                $"CARD-{Guid.NewGuid():N}"
                    .ToUpperInvariant();

            cardTokenExists =
                await _cardRepository
                    .CardTokenExistsAsync(cardToken);

        } while (cardTokenExists);

        return cardToken;
    }

    private static string GenerateLastFourDigits()
    {
        int number =
            RandomNumberGenerator.GetInt32(0, 10000);

        return number.ToString("D4");
    }
}
