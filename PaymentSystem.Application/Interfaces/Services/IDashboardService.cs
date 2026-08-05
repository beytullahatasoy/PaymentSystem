using PaymentSystem.Application.Dtos.Dashboard;

namespace PaymentSystem.Application.Interfaces.Services;

public interface IDashboardService
{
    Task<DashboardSummaryResponseDto> GetSummaryAsync();
}