namespace PaymentSystem.Application.Dtos.Payments;

public class PaymentHistoryResponseDto
{
    public int PaymentTransactionId { get; set; }
    public string TransactionReference { get; set; } = string.Empty;
    public int CardId { get; set; }
    public string CardBank { get; set; } = string.Empty;
    public string LastFourDigits { get; set; } = string.Empty;
    public int MerchantId { get; set; }
    public string MerchantCode { get; set; } = string.Empty;
    public string MerchantName { get; set; } = string.Empty;
    public long AmountMinor { get; set; }
    public string Currency { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string ResponseCode { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}