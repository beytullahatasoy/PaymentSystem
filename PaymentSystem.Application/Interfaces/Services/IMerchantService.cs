using PaymentSystem.Application.Dtos.Merchants;

namespace PaymentSystem.Application.Interfaces.Services;

public interface IMerchantService
{
    Task<List<MerchantResponseDto>> GetAllMerchantsAsync();
    Task<MerchantResponseDto> GetMerchantByIdAsync(int merchantId);

    Task<MerchantResponseDto> CreateMerchantAsync(
        CreateMerchantDto request);
}