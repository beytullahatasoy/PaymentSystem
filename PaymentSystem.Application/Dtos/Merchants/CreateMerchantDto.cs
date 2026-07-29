using System.ComponentModel.DataAnnotations;

namespace PaymentSystem.Application.Dtos.Merchants;

public class CreateMerchantDto
{
    [Required]
    [MaxLength(100)]
    public string MerchantName { get; set; } = string.Empty;

    [Required]
    [RegularExpression(@"^\d{4}$")]
    public string MerchantCategoryCode { get; set; } = string.Empty;
}