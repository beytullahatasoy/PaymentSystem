using PaymentSystem.Application.Dtos.Payments;
using PaymentSystem.Application.Interfaces.Repositories;
using PaymentSystem.Application.Interfaces.Services;
using PaymentSystem.Domain.Entities;

namespace PaymentSystem.Application.Services;

public class PaymentService : IPaymentService
{
    private readonly ICardRepository _cardRepository;
    private readonly IMerchantRepository _merchantRepository;
    private readonly IPaymentTransactionRepository
        _paymentTransactionRepository;

    public PaymentService(
        ICardRepository cardRepository,
        IMerchantRepository merchantRepository,
        IPaymentTransactionRepository paymentTransactionRepository)
    {
        _cardRepository = cardRepository;
        _merchantRepository = merchantRepository;
        _paymentTransactionRepository = paymentTransactionRepository;
    }

    public async Task<PaymentResponseDto> ProcessPaymentAsync(
        CreatePaymentDto request)
    {
        string normalizedCardToken =
            request.CardToken.Trim().ToUpperInvariant();

        string normalizedMerchantCode =
            request.MerchantCode.Trim().ToUpperInvariant();

        string normalizedCurrency =
            request.Currency.Trim().ToUpperInvariant();

        if (request.AmountMinor <= 0)
        {
            throw new ArgumentException(
                "Ödeme tutarı sıfırdan büyük olmalıdır.");
        }

        if (normalizedCurrency is not ("TRY" or "USD" or "EUR"))
        {
            throw new ArgumentException(
                "Sadece TRY, USD ve EUR para birimleri desteklenmektedir.");
        }

        Card? card = await _cardRepository
            .GetByTokenAsync(normalizedCardToken);

        if (card is null)
        {
            throw new KeyNotFoundException(
                "Kart bulunamadı.");
        }

        Merchant? merchant = await _merchantRepository
            .GetByCodeAsync(normalizedMerchantCode);

        if (merchant is null)
        {
            throw new KeyNotFoundException(
                "Satıcı bulunamadı.");
        }

        string transactionReference =
            await GenerateUniqueTransactionReferenceAsync();

        if (card.Status != "Active")
        {
            return await CreateDeclinedPaymentAsync(
                card,
                merchant,
                transactionReference,
                request.AmountMinor,
                normalizedCurrency,
                "01",
                "Kart aktif değil.");
        }

        if (IsCardExpired(card))
        {
            return await CreateDeclinedPaymentAsync(
                card,
                merchant,
                transactionReference,
                request.AmountMinor,
                normalizedCurrency,
                "02",
                "Kartın süresi dolmuştur");
        }

        BankAccount bankAccount = card.BankAccount;

        if (bankAccount.Status != "Active")
        {
            return await CreateDeclinedPaymentAsync(
                card,
                merchant,
                transactionReference,
                request.AmountMinor,
                normalizedCurrency,
                "03",
                "Banka hesabı aktif değil.");
        }

        if (!merchant.IsActive)
        {
            return await CreateDeclinedPaymentAsync(
                card,
                merchant,
                transactionReference,
                request.AmountMinor,
                normalizedCurrency,
                "04",
                "Satıcı aktif değildir.");
        }

        if (bankAccount.Currency != normalizedCurrency)
        {
            return await CreateDeclinedPaymentAsync(
                card,
                merchant,
                transactionReference,
                request.AmountMinor,
                normalizedCurrency,
                "05",
                "Ödeme para birimi, hesap para birimiyle eşleşmiyor.");
        }

        DateTime startOfDayUtc = DateTime.UtcNow.Date;
        DateTime endOfDayUtc = startOfDayUtc.AddDays(1);

        long approvedAmountToday =
            await _paymentTransactionRepository
                .GetApprovedAmountForCardAsync(
                    card.CardId,
                    startOfDayUtc,
                    endOfDayUtc);

        long totalAmountAfterPayment =
            approvedAmountToday + request.AmountMinor;

        if (totalAmountAfterPayment > card.DailyLimitMinor)
        {
            return await CreateDeclinedPaymentAsync(
                card,
                merchant,
                transactionReference,
                request.AmountMinor,
                normalizedCurrency,
                "06",
                "Bu işlem, kartınızın günlük harcama limitini aşar.");
        }

        if (bankAccount.BalanceMinor < request.AmountMinor)
        {
            return await CreateDeclinedPaymentAsync(
                card,
                merchant,
                transactionReference,
                request.AmountMinor,
                normalizedCurrency,
                "07",
                "Yetersiz hesap bakiyesi.");
        }

        bankAccount.BalanceMinor -= request.AmountMinor;

        PaymentTransaction paymentTransaction = new()
        {
            CardId = card.CardId,
            MerchantId = merchant.MerchantId,
            TransactionReference = transactionReference,
            AmountMinor = request.AmountMinor,
            Currency = normalizedCurrency,
            Status = "Approved",
            ResponseCode = "00",
            Description = "Payment approved."
        };

        await _paymentTransactionRepository
            .AddAsync(paymentTransaction);

        await _paymentTransactionRepository
            .SaveChangesAsync();

        return MapToResponse(paymentTransaction);
    }

    private async Task<PaymentResponseDto>
        CreateDeclinedPaymentAsync(
            Card card,
            Merchant merchant,
            string transactionReference,
            long amountMinor,
            string currency,
            string responseCode,
            string description)
    {
        PaymentTransaction paymentTransaction = new()
        {
            CardId = card.CardId,
            MerchantId = merchant.MerchantId,
            TransactionReference = transactionReference,
            AmountMinor = amountMinor,
            Currency = currency,
            Status = "Declined",
            ResponseCode = responseCode,
            Description = description
        };

        await _paymentTransactionRepository
            .AddAsync(paymentTransaction);

        await _paymentTransactionRepository
            .SaveChangesAsync();

        return MapToResponse(paymentTransaction);
    }

    private async Task<string>
        GenerateUniqueTransactionReferenceAsync()
    {
        string transactionReference;
        bool transactionReferenceExists;

        do
        {
            string uniquePart = Guid.NewGuid()
                .ToString("N")[..10]
                .ToUpperInvariant();

            transactionReference =
                $"TXN-{DateTime.UtcNow:yyyyMMddHHmmss}-{uniquePart}";

            transactionReferenceExists =
                await _paymentTransactionRepository
                    .TransactionReferenceExistsAsync(
                        transactionReference);

        } while (transactionReferenceExists);

        return transactionReference;
    }

    private static bool IsCardExpired(Card card)
    {
        DateTime currentDate = DateTime.UtcNow;

        return card.ExpiryYear < currentDate.Year ||
               card.ExpiryYear == currentDate.Year &&
               card.ExpiryMonth < currentDate.Month;
    }

    private static PaymentResponseDto MapToResponse(
        PaymentTransaction paymentTransaction)
    {
        return new PaymentResponseDto
        {
            PaymentTransactionId =
                paymentTransaction.PaymentTransactionId,

            TransactionReference =
                paymentTransaction.TransactionReference,

            AmountMinor = paymentTransaction.AmountMinor,
            Currency = paymentTransaction.Currency,
            Status = paymentTransaction.Status,
            ResponseCode = paymentTransaction.ResponseCode,
            Description = paymentTransaction.Description,
            CreatedAt = paymentTransaction.CreatedAt
        };
    }

    public async Task<List<PaymentHistoryResponseDto>>
    GetAllPaymentsAsync()
    {
        List<PaymentTransaction> paymentTransactions =
            await _paymentTransactionRepository.GetAllAsync();

        return paymentTransactions
            .Select(paymentTransaction =>
                MapToHistoryResponse(paymentTransaction))
            .ToList();
    }

    public async Task<PaymentHistoryResponseDto>
    GetPaymentByIdAsync(int paymentTransactionId)
    {
        PaymentTransaction? paymentTransaction =
            await _paymentTransactionRepository.GetByIdAsync(
                paymentTransactionId);

        if (paymentTransaction is null)
        {
            throw new KeyNotFoundException(
                "Ödeme işlemi bulunamadı.");
        }

        return MapToHistoryResponse(paymentTransaction);
    }

    private static PaymentHistoryResponseDto
    MapToHistoryResponse(
        PaymentTransaction paymentTransaction)
    {
        return new PaymentHistoryResponseDto
        {
            PaymentTransactionId = paymentTransaction.PaymentTransactionId,
            TransactionReference = paymentTransaction.TransactionReference,
            CardId = paymentTransaction.CardId,
            CardBank = paymentTransaction.Card.CardBank,
            LastFourDigits = paymentTransaction.Card.LastFourDigits,
            MerchantId = paymentTransaction.MerchantId,
            MerchantCode = paymentTransaction.Merchant.MerchantCode,
            MerchantName = paymentTransaction.Merchant.MerchantName,
            AmountMinor = paymentTransaction.AmountMinor,
            Currency = paymentTransaction.Currency, 
            Status = paymentTransaction.Status,
            ResponseCode = paymentTransaction.ResponseCode,
            Description = paymentTransaction.Description,
            CreatedAt = paymentTransaction.CreatedAt
        };
    }
}