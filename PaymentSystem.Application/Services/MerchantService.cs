using PaymentSystem.Application.Dtos.Merchants;
using PaymentSystem.Application.Interfaces.Repositories;
using PaymentSystem.Application.Interfaces.Services;
using PaymentSystem.Domain.Entities;

namespace PaymentSystem.Application.Services;

public class MerchantService : IMerchantService
{
    private readonly IMerchantRepository _merchantRepository;

    public MerchantService(
        IMerchantRepository merchantRepository)
    {
        _merchantRepository = merchantRepository;
    }

    public async Task<MerchantResponseDto> CreateMerchantAsync(
        CreateMerchantDto request)
    {
        string normalizedMerchantName =
            request.MerchantName.Trim();

        string normalizedCategoryCode =
            request.MerchantCategoryCode.Trim();

        string merchantCode =
            await GenerateUniqueMerchantCodeAsync();

        Merchant merchant = new()
        {
            MerchantCode = merchantCode,
            MerchantName = normalizedMerchantName,
            MerchantCategoryCode = normalizedCategoryCode,
            IsActive = true
        };

        await _merchantRepository.AddAsync(merchant);
        await _merchantRepository.SaveChangesAsync();

        MerchantResponseDto response = new()
        {
            MerchantId = merchant.MerchantId,
            MerchantCode = merchant.MerchantCode,
            MerchantName = merchant.MerchantName,
            MerchantCategoryCode =
                merchant.MerchantCategoryCode,
            IsActive = merchant.IsActive,
            CreatedAt = merchant.CreatedAt
        };
        return response;
    }

    private async Task<string> GenerateUniqueMerchantCodeAsync()
    {
        string merchantCode;
        bool merchantCodeExists;

        do
        {
            string uniquePart = Guid.NewGuid()
                .ToString("N")[..8]
                .ToUpperInvariant();

            merchantCode =
                $"MER-{DateTime.UtcNow:yyyyMMdd}-{uniquePart}";

            merchantCodeExists =
                await _merchantRepository
                    .MerchantCodeExistsAsync(merchantCode);

        } while (merchantCodeExists);
        return merchantCode;
    }
}