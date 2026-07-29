using PaymentSystem.Application.Dtos.Customers;

namespace PaymentSystem.Application.Interfaces.Services;

public interface ICustomerService
{
    Task<CustomerResponseDto> CreateCustomerAsync(
        CreateCustomerDto request);
}
