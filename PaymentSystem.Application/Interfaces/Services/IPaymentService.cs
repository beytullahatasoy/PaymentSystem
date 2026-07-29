using PaymentSystem.Application.Dtos.Payments;

namespace PaymentSystem.Application.Interfaces.Services;

public interface IPaymentService
{
    Task<PaymentResponseDto> ProcessPaymentAsync
        (CreatePaymentDto Request);
}