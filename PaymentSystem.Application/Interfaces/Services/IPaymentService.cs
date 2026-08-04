using PaymentSystem.Application.Dtos.Payments;

namespace PaymentSystem.Application.Interfaces.Services;

public interface IPaymentService
{
    Task<List<PaymentHistoryResponseDto>> GetAllPaymentsAsync();
    Task<PaymentHistoryResponseDto> GetPaymentByIdAsync(int paymentTransactionId);

    Task<PaymentResponseDto> ProcessPaymentAsync
        (CreatePaymentDto Request);
}