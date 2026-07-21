namespace PaymentSystem.Api.Models;

public class BankAccount
{
    public int BankAccountId { get; set; }
    public int CustomerId { get; set; }
    public string AccountNumber { get; set; } = string.Empty;
    public long BalanceMinor { get; set; }
    public string Currency { get; set; } = "TRY";
    public string Status { get; set; } = "Active";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Customer Customer { get; set; } = null!;
    public List<Card> Cards { get; set; } = new(); // BankAccount nesnesi oluştuğu anda Cards alanı boş ama kullanılabilir bir liste olsun
}
