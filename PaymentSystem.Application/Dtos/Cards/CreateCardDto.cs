using System.ComponentModel.DataAnnotations;

namespace PaymentSystem.Application.Dtos.Cards;

public class CreateCardDto
{
    [Range(1, int.MaxValue)]
    public int BankAccountId { get; set; }

    [Required]
    [MaxLength(20)]
    public string CardBank { get; set; } = string.Empty;

    [Range(1, long.MaxValue)]
    public long DailyLimitMinor { get; set; }
}