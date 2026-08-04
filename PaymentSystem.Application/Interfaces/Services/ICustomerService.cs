using PaymentSystem.Application.Dtos.Customers;

namespace PaymentSystem.Application.Interfaces.Services;

public interface ICustomerService
{
    Task<List<CustomerResponseDto>> GetAllCustomersAsync();
    Task<CustomerResponseDto> GetCustomerByIdAsync(int customerId);

    Task<CustomerResponseDto> CreateCustomerAsync(
        CreateCustomerDto request);
}
