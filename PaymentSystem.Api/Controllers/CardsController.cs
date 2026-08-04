using Microsoft.AspNetCore.Mvc;
using PaymentSystem.Application.Dtos.Cards;
using PaymentSystem.Application.Interfaces.Services;

namespace PaymentSystem.Api.Controllers;

[ApiController]
[Route("api/cards")]
public class CardsController : ControllerBase
{
    private readonly ICardService _cardService;

    public CardsController(ICardService cardService)
    {
        _cardService = cardService;
    }

    [HttpGet("by-bank-account/{bankAccountId:int}")]
    public async Task<ActionResult<List<CardResponseDto>>>
    GetCardsByBankAccountId(int bankAccountId)
    {
        try
        {
            List<CardResponseDto> cards =
                await _cardService
                    .GetCardsByBankAccountIdAsync(bankAccountId);

            return Ok(cards);
        }
        catch (KeyNotFoundException exception)
        {
            return NotFound(new
            {
                message = exception.Message
            });
        }
    }

    [HttpPost]
    public async Task<ActionResult<CardResponseDto>> CreateCard(
        CreateCardDto request)
    {
        try
        {
            CardResponseDto createdCard =
                await _cardService.CreateCardAsync(request);

            return Created(
                $"/api/cards/{createdCard.CardId}",
                createdCard);
        }
        catch (KeyNotFoundException exception)
        {
            return NotFound(new
            {
                message = exception.Message
            });
        }
        catch (InvalidOperationException exception)
        {
            return Conflict(new
            {
                message = exception.Message
            });
        }
        catch (ArgumentException exception)
        {
            return BadRequest(new
            {
                message = exception.Message
            });
        }
    }
}