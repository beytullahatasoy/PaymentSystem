using Microsoft.AspNetCore.Mvc;
using PaymentSystem.Application.Dtos.Customers;
using PaymentSystem.Application.Interfaces.Services;

namespace PaymentSystem.Api.Controllers;

[ApiController]
[Route("api/customers")]
public class CustomerController : ControllerBase
{
    private readonly ICustomerService _customerService;
    public CustomerController(ICustomerService customerService)
    {
        _customerService = customerService;
    }

    [HttpPost]
    public async Task<ActionResult<CustomerResponseDto>> CreateCustomer(CreateCustomerDto request)
    {
        try
        {
            CustomerResponseDto createdCustomer = await _customerService.CreateCustomerAsync(request);
            return Created($"/api/customers/{createdCustomer.CustomerId}", createdCustomer);
        }
        catch (InvalidOperationException exception)
        {
            return Conflict(new { message = exception.Message });
        }
    }
}