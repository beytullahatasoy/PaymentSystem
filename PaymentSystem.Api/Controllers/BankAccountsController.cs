using Microsoft.AspNetCore.Mvc; 
using PaymentSystem.Application.Interfaces.Services;
using PaymentSystem.Application.Dtos.BankAccounts;

namespace PaymentSystem.Api.Controllers;

[ApiController]
[Route("api/bank-accounts")]
public class BankAccountsController : ControllerBase
{
    private readonly IBankAccountService _bankAccountService;

    public BankAccountsController(IBankAccountService bankAccountService)
    {
        _bankAccountService = bankAccountService;
    }

    [HttpPost]
    public async Task<ActionResult<BankAccountResponseDto>>
        CreateBankAccount(CreateBankAccountDto request)
    {
        try
        {
            BankAccountResponseDto createdBankAccount =
                await _bankAccountService
                    .CreateBankAccountAsync(request);

            return Created(
                $"/api/bank-accounts/{createdBankAccount.BankAccountId}",
                createdBankAccount);
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
