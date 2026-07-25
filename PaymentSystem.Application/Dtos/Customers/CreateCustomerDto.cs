using System.ComponentModel.DataAnnotations; // Required gibi sınıflar için gerekli olan namespace

namespace PaymentSystem.Application.Dtos.Customers;

public class CreateCustomerDto  // Kullanıcı yalnızca izin verdiğimiz alanları gönderebilsin diye olusturulmus DTO sınıfı
{
    [Required]
    [MaxLength(50)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string LastName { get; set; } = string.Empty;

    [Required]
    [EmailAddress] // Email formatinda olup olmadığını kontrol eder
    [MaxLength(100)]
    public string Email { get; set; } = string.Empty;
}