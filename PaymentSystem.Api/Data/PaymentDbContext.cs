using Microsoft.EntityFrameworkCore;
using PaymentSystem.Api.Models;

namespace PaymentSystem.Api.Data;

public class PaymentDbContext : DbContext
{
    public PaymentDbContext(
        DbContextOptions<PaymentDbContext> veritabaniAyarlari)
        : base(veritabaniAyarlari)
    { 
    }

    public DbSet<Customer> Customers { get; set; } = null!;
    public DbSet<BankAccount> BankAccounts { get; set; } = null!;
    public DbSet<Card> Cards { get; set; } = null!;
    public DbSet<Merchant> Merchants { get; set; } = null!;
    public DbSet<PaymentTransaction> PaymentTransactions { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelOlusturucu)
    {
        base.OnModelCreating(modelOlusturucu);

        modelOlusturucu.Entity<BankAccount>()
            .HasOne(hesap => hesap.Customer)
            .WithMany(musteri => musteri.BankAccounts)
            .HasForeignKey(hesap => hesap.CustomerId);
        
        modelOlusturucu.Entity<Card>()
            .HasOne(kart => kart.BankAccount)
            .WithMany(hesap => hesap.Cards)
            .HasForeignKey(kart => kart.BankAccountId);

        modelOlusturucu.Entity<PaymentTransaction>()
            .HasOne(islem => islem.Card)
            .WithMany(kart => kart.PaymentTransactions)
            .HasForeignKey(islem => islem.CardId);

        modelOlusturucu.Entity<PaymentTransaction>()
            .HasOne(islem => islem.Merchant)
            .WithMany(isYeri => isYeri.PaymentTransactions)
            .HasForeignKey(islem => islem.MerchantId);
    }
}
