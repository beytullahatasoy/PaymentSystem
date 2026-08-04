using PaymentSystem.Application.Dtos.BankAccounts;

namespace PaymentSystem.Application.Interfaces.Services;

public interface IBankAccountService
{
    Task<BankAccountResponseDto> GetBankAccountByIdAsync(
    int bankAccountId);

    Task<List<BankAccountResponseDto>> GetBankAccountsByCustomerIdAsync(
        int customerId);

    Task<BankAccountResponseDto> CreateBankAccountAsync
        (CreateBankAccountDto request);
    Task<BankAccountResponseDto> DepositAsync(
    int bankAccountId,
    DepositBankAccountDto request);
}
