namespace PaymentSystem.Domain.Entities;

public class Card
{
    public int CardId { get; set; }
    public int BankAccountId { get; set; }
    public string CardToken { get; set; } = string.Empty;
    public string CardBank { get; set; } = string.Empty;
    public string LastFourDigits { get; set; } = string.Empty;
    public int ExpiryMonth { get; set; } 
    public int ExpiryYear { get; set; } 
    public long DailyLimitMinor { get; set; }
    public string Status { get; set; } = "Active";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public BankAccount BankAccount { get; set; } = null!;
    public List<PaymentTransaction> PaymentTransactions { get; set; } = new();

}
