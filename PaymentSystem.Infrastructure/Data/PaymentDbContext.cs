using Microsoft.EntityFrameworkCore;
using PaymentSystem.Domain.Entities;

namespace PaymentSystem.Infrastructure.Data;

public class PaymentDbContext : DbContext
{
    public PaymentDbContext(
        DbContextOptions<PaymentDbContext> options)
        : base(options)
    {
    }

    public DbSet<Customer> Customers { get; set; } = null!;
    public DbSet<BankAccount> BankAccounts { get; set; } = null!;
    public DbSet<Card> Cards { get; set; } = null!;
    public DbSet<Merchant> Merchants { get; set; } = null!;
    public DbSet<PaymentTransaction> PaymentTransactions { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<BankAccount>()
            .HasOne(account => account.Customer)
            .WithMany(customer => customer.BankAccounts)
            .HasForeignKey(account => account.CustomerId);

        modelBuilder.Entity<Card>()
            .HasOne(card => card.BankAccount)
            .WithMany(account => account.Cards)
            .HasForeignKey(card => card.BankAccountId);

        modelBuilder.Entity<PaymentTransaction>()
            .HasOne(transaction => transaction.Card)
            .WithMany(card => card.PaymentTransactions)
            .HasForeignKey(transaction => transaction.CardId);

        modelBuilder.Entity<PaymentTransaction>()
            .HasOne(transaction => transaction.Merchant)
            .WithMany(merchant => merchant.PaymentTransactions)
            .HasForeignKey(transaction => transaction.MerchantId);

        modelBuilder.Entity<Customer>()
            .HasIndex(customer => customer.Email)
            .IsUnique();

        modelBuilder.Entity<BankAccount>()
            .HasIndex(account => account.AccountNumber)
            .IsUnique();

        modelBuilder.Entity<Card>()
            .HasIndex(card => card.CardToken)
            .IsUnique();

        modelBuilder.Entity<Merchant>()
            .HasIndex(merchant => merchant.MerchantCode)
            .IsUnique();

        modelBuilder.Entity<PaymentTransaction>()
            .HasIndex(transaction => transaction.TransactionReference)
            .IsUnique();
    }
}