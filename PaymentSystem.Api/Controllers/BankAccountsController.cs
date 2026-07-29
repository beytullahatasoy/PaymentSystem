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

    [HttpPost("{bankAccountId:int}/deposit")]
    public async Task<ActionResult<BankAccountResponseDto>> Deposit(
    int bankAccountId,
    DepositBankAccountDto request)
    {
        try
        {
            BankAccountResponseDto updatedBankAccount =
                await _bankAccountService.DepositAsync(
                    bankAccountId,
                    request);

            return Ok(updatedBankAccount);
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
