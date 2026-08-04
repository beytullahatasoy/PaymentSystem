using PaymentSystem.Application.Interfaces.Services;
using PaymentSystem.Application.Dtos.BankAccounts;
using PaymentSystem.Application.Interfaces.Repositories;
using PaymentSystem.Domain.Entities;

namespace PaymentSystem.Application.Services;

public class BankAccountService : IBankAccountService
{
    private readonly ICustomerRepository _customerRepository;
    private readonly IBankAccountRepository _bankAccountRepository;

    public BankAccountService(ICustomerRepository customerRepository, 
        IBankAccountRepository bankAccountRepository)
    {
        _customerRepository = customerRepository;
        _bankAccountRepository = bankAccountRepository;
    }

    public async Task<BankAccountResponseDto> CreateBankAccountAsync(CreateBankAccountDto request)
    {
        Customer? customer = await _customerRepository
            .GetByIdAsync(request.CustomerId);

        if (customer is null)
        {
            throw new KeyNotFoundException(
                "Musteri bulunamadi.");
        }

        if (!customer.IsActive)
        {
            throw new InvalidOperationException(
                "Aktif olmayan bir müsteri icin banka hesabı acilamaz.");
        }

        string normalizedCurrency = request.Currency
            .Trim()
            .ToUpperInvariant();

        if (normalizedCurrency is not ("TRY" or "USD" or "EUR"))
        {
            throw new ArgumentException(
                "Sadece TRY, USD ve EUR para birimleri desteklenmektedir.");
        }

        string accountNumber =
            await GenerateUniqueAccountNumberAsync();

        BankAccount bankAccount = new()
        {
            CustomerId = customer.CustomerId,
            AccountNumber = accountNumber,
            BalanceMinor = 0,
            Currency = normalizedCurrency,
            Status = "Active"
        };

        await _bankAccountRepository.AddAsync(bankAccount);
        await _bankAccountRepository.SaveChangesAsync();

        BankAccountResponseDto response = new()
        {
            BankAccountId = bankAccount.BankAccountId,
            CustomerId = bankAccount.CustomerId,
            AccountNumber = bankAccount.AccountNumber,
            BalanceMinor = bankAccount.BalanceMinor,
            Currency = bankAccount.Currency,
            Status = bankAccount.Status,
            CreatedAt = bankAccount.CreatedAt
        };

        return response;
    }

    public async Task<BankAccountResponseDto> DepositAsync(
    int bankAccountId,
    DepositBankAccountDto request)
    {
        BankAccount? bankAccount =
            await _bankAccountRepository.GetByIdAsync(bankAccountId);

        if (bankAccount is null)
        {
            throw new KeyNotFoundException(
                "Banka hesabı bulunamadı.");
        }

        if (bankAccount.Status != "Active")
        {
            throw new InvalidOperationException(
                "Aktif olmayan banka hesabına bakiye eklenemez.");
        }

        if (request.AmountMinor <= 0)
        {
            throw new ArgumentException(
                "Yatırılacak tutar sıfırdan büyük olmalıdır.");
        }

        bankAccount.BalanceMinor += request.AmountMinor;

        await _bankAccountRepository.SaveChangesAsync();

        return new BankAccountResponseDto
        {
            BankAccountId = bankAccount.BankAccountId,
            CustomerId = bankAccount.CustomerId,
            AccountNumber = bankAccount.AccountNumber,
            BalanceMinor = bankAccount.BalanceMinor,
            Currency = bankAccount.Currency,
            Status = bankAccount.Status,
            CreatedAt = bankAccount.CreatedAt
        };
    }

    private async Task<string> GenerateUniqueAccountNumberAsync()
    {
        string accountNumber;
        bool accountNumberExists;

        do
        {
            string uniquePart = Guid.NewGuid()
                .ToString("N")[..8]
                .ToUpperInvariant();

            accountNumber =
                $"ACC-{DateTime.UtcNow:yyyyMMdd}-{uniquePart}";

            accountNumberExists =
                await _bankAccountRepository
                    .AccountNumberExistsAsync(accountNumber);

        } while (accountNumberExists);

        return accountNumber;
    }

    public async Task<BankAccountResponseDto> GetBankAccountByIdAsync(
    int bankAccountId)
    {
        BankAccount? bankAccount =
            await _bankAccountRepository.GetByIdAsync(bankAccountId);

        if (bankAccount is null)
        {
            throw new KeyNotFoundException("Banka hesabı bulunamadı.");
        }

        return MapToResponse(bankAccount);
    }

    public async Task<List<BankAccountResponseDto>>
    GetBankAccountsByCustomerIdAsync(int customerId)
    {
        Customer? customer =
            await _customerRepository.GetByIdAsync(customerId);

        if (customer is null)
        {
            throw new KeyNotFoundException("Müşteri bulunamadı.");
        }

        List<BankAccount> bankAccounts =
            await _bankAccountRepository.GetByCustomerIdAsync(customerId);

        return bankAccounts
            .Select(bankAccount => MapToResponse(bankAccount))
            .ToList();
    }

    private static BankAccountResponseDto MapToResponse(
    BankAccount bankAccount)
    {
        return new BankAccountResponseDto
        {
            BankAccountId = bankAccount.BankAccountId,
            CustomerId = bankAccount.CustomerId,
            AccountNumber = bankAccount.AccountNumber,
            BalanceMinor = bankAccount.BalanceMinor,
            Currency = bankAccount.Currency,
            Status = bankAccount.Status,
            CreatedAt = bankAccount.CreatedAt
        };
    }
}
