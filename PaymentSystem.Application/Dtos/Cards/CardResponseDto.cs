namespace PaymentSystem.Application.Dtos.Cards;

public class CardResponseDto
{
    public int CardId { get; set; }
    public int BankAccountId { get; set; }
    public string CardToken { get; set; } = string.Empty;
    public string CardBank { get; set; } = string.Empty;
    public string LastFourDigits { get; set; } = string.Empty;
    public int ExpiryMonth { get; set; }
    public int ExpiryYear { get; set; }
    public long DailyLimitMinor { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
