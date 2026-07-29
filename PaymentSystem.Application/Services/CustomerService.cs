using PaymentSystem.Application.Dtos.Customers;
using PaymentSystem.Application.Interfaces.Services;
using PaymentSystem.Domain.Entities;
using PaymentSystem.Application.Interfaces.Repositories;

namespace PaymentSystem.Application.Services;

public class CustomerService : ICustomerService
{   
    private readonly ICustomerRepository _customerRepository;

    public CustomerService(ICustomerRepository customerRepository)
    {
        _customerRepository = customerRepository;
    }

    public async Task<CustomerResponseDto> CreateCustomerAsync(CreateCustomerDto request)
    {
        string normalizedEmail = request.Email
            .Trim()
            .ToLowerInvariant();

        bool emailExists = await _customerRepository
            .EmailExistsAsync(normalizedEmail);

        if (emailExists)
        {
            throw new InvalidOperationException(
                "Bu e-mail adresine sahip bir müşteri mevcut.");
        }

        Customer customer = new()
        {
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim(),
            Email = normalizedEmail
        };

        await _customerRepository.AddAsync(customer);
        await _customerRepository.SaveChangesAsync();

        CustomerResponseDto response = new()
        {
            CustomerId = customer.CustomerId,
            FirstName = customer.FirstName,
            LastName = customer.LastName,
            Email = customer.Email,
            CreatedAt = customer.CreatedAt,
            IsActive = customer.IsActive
        };

        return response;
    }
}
