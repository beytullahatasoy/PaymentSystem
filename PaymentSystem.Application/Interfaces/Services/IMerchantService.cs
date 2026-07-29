using PaymentSystem.Application.Dtos.Merchants;

namespace PaymentSystem.Application.Interfaces.Services;

public interface IMerchantService
{
    Task<MerchantResponseDto> CreateMerchantAsync(
        CreateMerchantDto request);
}