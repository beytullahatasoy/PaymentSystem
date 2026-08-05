using Microsoft.AspNetCore.Mvc;
using PaymentSystem.Application.Dtos.Dashboard;
using PaymentSystem.Application.Interfaces.Services;

namespace PaymentSystem.Api.Controllers;

[ApiController]
[Route("api/dashboard")]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService
        _dashboardService;

    public DashboardController(
        IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet("summary")]
    public async Task<
        ActionResult<DashboardSummaryResponseDto>>
        GetSummary()
    {
        DashboardSummaryResponseDto summary =
            await _dashboardService
                .GetSummaryAsync();

        return Ok(summary);
    }
}