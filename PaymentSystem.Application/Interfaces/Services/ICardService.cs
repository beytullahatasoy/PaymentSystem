using PaymentSystem.Application.Dtos.Cards;

namespace PaymentSystem.Application.Interfaces.Services;

public interface ICardService
{
    Task<CardResponseDto> CreateCardAsync(
        CreateCardDto request);
}
