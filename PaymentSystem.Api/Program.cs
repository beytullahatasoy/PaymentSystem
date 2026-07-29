using Microsoft.EntityFrameworkCore;
using PaymentSystem.Infrastructure.Data;

using PaymentSystem.Application.Interfaces.Repositories;
using PaymentSystem.Infrastructure.Repositories;
using PaymentSystem.Application.Interfaces.Services;
using PaymentSystem.Application.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

//
builder.Services.AddDbContext<PaymentDbContext>(veritabaiAyarlari =>
{
    veritabaiAyarlari.UseSqlServer(
        builder.Configuration.GetConnectionString("PaymentSystemDbBaglantisi"));
});

builder.Services.AddScoped<ICustomerService, CustomerService>();
builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();

builder.Services.AddScoped<IBankAccountService, BankAccountService>();
builder.Services.AddScoped<IBankAccountRepository, BankAccountRepository>();

builder.Services.AddScoped<ICardService, CardService>();
builder.Services.AddScoped<ICardRepository, CardRepository>();

builder.Services.AddScoped<IMerchantService, MerchantService>();
builder.Services.AddScoped<IMerchantRepository, MerchantRepository>();
//

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
