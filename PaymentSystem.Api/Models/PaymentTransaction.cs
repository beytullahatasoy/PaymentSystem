namespace PaymentSystem.Api.Models;

public class PaymentTransaction
{
    public int PaymentTransactionId { get; set; }
    public int CardId { get; set; }
    public int MerchantId { get; set; }
    public string TransactionReference { get; set; } = string.Empty;
    public long AmountMinor { get; set; }
    public string Currency { get; set; } = "TRY";
    public string Status { get; set; } = "Pending";
    public string ResponseCode { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Card Card { get; set; } = null!; // islemin kullanildigi kart
    public Merchant Merchant { get; set; } = null!; // odemenin yapildigi isyeri
}
