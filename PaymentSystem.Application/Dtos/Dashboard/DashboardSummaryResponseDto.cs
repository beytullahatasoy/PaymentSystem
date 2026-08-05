using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PaymentSystem.Application.Dtos.Dashboard;

public class DashboardSummaryResponseDto
{
    public int TotalCustomers { get; set; }
    public int TotalBankAccounts { get; set; }
    public int ActiveCards { get; set; }
    public int TotalMerchants { get; set; }
    public int TotalTransactions { get; set; }
    public int ApprovedTransactions { get; set; }
    public int DeclinedTransactions { get; set; }
    public List<DashboardRecentTransactionDto> RecentTransactions{ get; set; } = new();
}
