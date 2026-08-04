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

    [HttpGet]
    public async Task<ActionResult<List<CustomerResponseDto>>> GetAllCustomers()
    {
        List<CustomerResponseDto> customers = await _customerService.GetAllCustomersAsync();
        return Ok(customers);
    }

    [HttpGet("{customerId:int}")]
    public async Task<ActionResult<CustomerResponseDto>> GetCustomerById(
        int customerId)
    {
        try 
        {
            CustomerResponseDto customer = await _customerService.GetCustomerByIdAsync(customerId);
            return Ok(customer);
        }
        catch (KeyNotFoundException exception)
        {
            return NotFound(new { message = exception.Message });
        }
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