namespace PaymentSystem.Application.Dtos.Payment;

public class PaymentResponseDto
{
    public int PaymentTransactionId { get; set; }
    public string TransactionReference { get; set; } = string.Empty;
    public long AmountMinor { get; set; }
    public string Currency { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string ResponseCode { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
