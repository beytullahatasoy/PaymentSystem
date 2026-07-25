using PaymentSystem.Application.Dtos.Customers;

namespace PaymentSystem.Application.Interfaces.Services;

public interface ICustomerService
{
    Task<CustomerResponseDto> CreateCustomerAsync( /* doğrudan CustomerResponseDto döndürmek yerine, 
                                                    * CreateCustomerAsync metodunun CustomerResponseDto tipinde bir Task döndürmesini sağlıyoruz. 
                                                    * Bu, asenkron bir işlem olduğunu ve sonuç olarak CustomerResponseDto tipinde bir nesne döndüreceğini belirtir. */
        CreateCustomerDto request);
}
