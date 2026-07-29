namespace PaymentSystem.Application.Dtos.Merchants;

public class MerchantResponseDto
{
    public int MerchantId { get; set; }
    public string MerchantCode { get; set; } = string.Empty;
    public string MerchantName { get; set; } = string.Empty;
    public string MerchantCategoryCode { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}