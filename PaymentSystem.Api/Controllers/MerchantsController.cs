using Microsoft.AspNetCore.Mvc;
using PaymentSystem.Application.Dtos.Merchants;
using PaymentSystem.Application.Interfaces.Services;

namespace PaymentSystem.Api.Controllers;

[ApiController]
[Route("api/merchants")]
public class MerchantsController : ControllerBase
{
    private readonly IMerchantService _merchantService;

    public MerchantsController(
        IMerchantService merchantService)
    {
        _merchantService = merchantService;
    }

    [HttpGet]
    public async Task<ActionResult<List<MerchantResponseDto>>>
    GetAllMerchants()
    {
        List<MerchantResponseDto> merchants =
            await _merchantService.GetAllMerchantsAsync();

        return Ok(merchants);
    }

    [HttpGet("{merchantId:int}")]
    public async Task<ActionResult<MerchantResponseDto>>
    GetMerchantById(int merchantId)
    {
        try
        {
            MerchantResponseDto merchant =
                await _merchantService.GetMerchantByIdAsync(
                    merchantId);

            return Ok(merchant);
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
    public async Task<ActionResult<MerchantResponseDto>> CreateMerchant(
        CreateMerchantDto request)
    {
        try
        {
            MerchantResponseDto createdMerchant =
                await _merchantService.CreateMerchantAsync(request);

            return Created(
                $"/api/merchants/{createdMerchant.MerchantId}",
                createdMerchant);
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