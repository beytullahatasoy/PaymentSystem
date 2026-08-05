using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PaymentSystem.Application.Dtos.Dashboard;

public class DashboardRecentTransactionDto
{
    public int PaymentTransactionId { get; set; }
    public string TransactionReference { get; set; } = string.Empty;
    public string MerchantName { get; set; } = string.Empty;
    public string CardBank { get; set; } = string.Empty;
    public string LastFourDigits { get; set; } = string.Empty;
    public long AmountMinor { get; set; }
    public string Currency { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}