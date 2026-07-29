using System.ComponentModel.DataAnnotations;

namespace PaymentSystem.Application.Dtos.BankAccounts;

public class DepositBankAccountDto
{
    [Range(1, long.MaxValue)]
    public long AmountMinor { get; set; }
}