using System.ComponentModel.DataAnnotations;

namespace PaymentSystem.Application.Dtos.Payments;

public class CreatePaymentDto
{
    [Required]
    [MaxLength(100)]
    public string CardToken { get; set; } = string.Empty;   

    [Required]
    [MaxLength(50)]
    public string MerchantCode { get; set; } = string.Empty;

    [Range(1, long.MaxValue)]
    public long AmountMinor { get; set; }

    [Required]
    [StringLength(3, MinimumLength=3)]
    public string Currency { get; set; } = "TRY";
}
