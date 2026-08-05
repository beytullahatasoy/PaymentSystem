using PaymentSystem.Application.Dtos.Dashboard;
using PaymentSystem.Application.Interfaces.Repositories;
using PaymentSystem.Application.Interfaces.Services;
using PaymentSystem.Domain.Entities;

namespace PaymentSystem.Application.Services;

public class DashboardService
    : IDashboardService
{
    private readonly IDashboardRepository
        _dashboardRepository;

    public DashboardService(
        IDashboardRepository dashboardRepository)
    {
        _dashboardRepository = dashboardRepository;
    }

    public async Task<DashboardSummaryResponseDto>
        GetSummaryAsync()
    {
        int totalCustomers =
            await _dashboardRepository
                .CountCustomersAsync();

        int totalBankAccounts =
            await _dashboardRepository
                .CountBankAccountsAsync();

        int activeCards =
            await _dashboardRepository
                .CountActiveCardsAsync();

        int totalMerchants =
            await _dashboardRepository
                .CountMerchantsAsync();

        int totalTransactions =
            await _dashboardRepository
                .CountTransactionsAsync();

        int approvedTransactions =
            await _dashboardRepository
                .CountTransactionsByStatusAsync(
                    "Approved");

        int declinedTransactions =
            await _dashboardRepository
                .CountTransactionsByStatusAsync(
                    "Declined");

        List<PaymentTransaction>
            recentTransactions =
                await _dashboardRepository
                    .GetRecentTransactionsAsync(5);

        return new DashboardSummaryResponseDto
        {
            TotalCustomers = totalCustomers,

            TotalBankAccounts = totalBankAccounts,

            ActiveCards = activeCards,

            TotalMerchants = totalMerchants,

            TotalTransactions = totalTransactions,

            ApprovedTransactions = approvedTransactions,

            DeclinedTransactions = declinedTransactions,

            RecentTransactions =
                recentTransactions
                    .Select(MapRecentTransaction)
                    .ToList()
        };
    }

    private static DashboardRecentTransactionDto
        MapRecentTransaction(
            PaymentTransaction transaction)
    {
        return new DashboardRecentTransactionDto
        {
            PaymentTransactionId = transaction.PaymentTransactionId,

            TransactionReference = transaction.TransactionReference,

            MerchantName = transaction.Merchant.MerchantName,

            CardBank = transaction.Card.CardBank,

            LastFourDigits = transaction.Card.LastFourDigits,

            AmountMinor = transaction.AmountMinor,

            Currency = transaction.Currency,

            Status = transaction.Status,

            CreatedAt = transaction.CreatedAt
        };
    }
}