using PaymentSystem.Application.Dtos.BankAccounts;

namespace PaymentSystem.Application.Interfaces.Services;

public interface IBankAccountService
{
    Task<BankAccountResponseDto> CreateBankAccountAsync
        (CreateBankAccountDto request);
}
