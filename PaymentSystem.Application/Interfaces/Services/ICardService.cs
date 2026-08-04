using PaymentSystem.Application.Dtos.Cards;

namespace PaymentSystem.Application.Interfaces.Services;

public interface ICardService
{
    Task<List<CardResponseDto>> GetCardsByBankAccountIdAsync(
    int bankAccountId);

    Task<CardResponseDto> CreateCardAsync(
        CreateCardDto request);
}
