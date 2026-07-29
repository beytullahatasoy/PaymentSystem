using Microsoft.AspNetCore.Mvc;
using PaymentSystem.Application.Dtos.Payments;
using PaymentSystem.Application.Interfaces.Services;

namespace PaymentSystem.Api.Controllers;

[ApiController]
[Route("api/payments")]
public class PaymentsController : ControllerBase
{
    private readonly IPaymentService _paymentService;

    public PaymentsController(IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }


    [HttpPost]
    public async Task<ActionResult<PaymentResponseDto>> ProcessPayment(
        CreatePaymentDto request)
    {
        try
        {
            PaymentResponseDto paymentResult =
                await _paymentService.ProcessPaymentAsync(request);

            return Ok(paymentResult);
        }
        catch (KeyNotFoundException exception)
        {
            return NotFound(new
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