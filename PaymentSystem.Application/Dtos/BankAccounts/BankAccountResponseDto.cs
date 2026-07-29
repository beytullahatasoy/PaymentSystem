namespace PaymentSystem.Application.Dtos.BankAccounts;

public class BankAccountResponseDto
{
    public int BankAccountId { get; set; }
    public int CustomerId { get; set; }
    public string AccountNumber { get; set; } = string.Empty;
    public long BalanceMinor { get; set; }
    public string Currency { get; set; } = "TRY";
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
