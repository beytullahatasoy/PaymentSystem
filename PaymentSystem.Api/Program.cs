using Microsoft.EntityFrameworkCore;
using PaymentSystem.Infrastructure.Data;

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
