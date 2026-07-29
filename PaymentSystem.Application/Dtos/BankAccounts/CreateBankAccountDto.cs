using System.ComponentModel.DataAnnotations;

namespace PaymentSystem.Application.Dtos.BankAccounts;

public class CreateBankAccountDto
{
    [Range(1, int.MaxValue)]
    public int CustomerId { get; set; }

    [Required]
    [StringLength(3, MinimumLength = 3)]
    public string Currency { get; set; } =  "TRY";
}