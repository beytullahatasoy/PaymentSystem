using PaymentSystem.Application.Dtos.Customers;

namespace PaymentSystem.Application.Interfaces.Services;

internal interface ICustomerService
{
    Task<CustomerResponseDto> CreateCustomerAsync(
        CreateCustomerDto request);
}
