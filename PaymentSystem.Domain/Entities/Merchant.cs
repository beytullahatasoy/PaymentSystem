namespace PaymentSystem.Domain.Entities;

public class Merchant
{
    public int MerchantId { get; set; }
    public string MerchantCode { get; set; } = string.Empty;
    public string MerchantName { get; set; } = string.Empty;
    public string MerchantCategoryCode { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public List<PaymentTransaction> PaymentTransactions { get; set; } = new();
}
