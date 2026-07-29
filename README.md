# PaymentSystem

ASP.NET Core, EF Core ve SQL Server kullanılarak geliştirilen
katmanlı ödeme sistemi simülasyonudur.

## Architecture

- PaymentSystem.Domain
- PaymentSystem.Application
- PaymentSystem.Infrastructure
- PaymentSystem.Api

## Features

- Customer creation
- Bank account creation
- Test balance deposit
- Card creation
- Merchant creation
- Payment processing
- Balance and daily-limit validation
- Approved and declined transaction records

## Important Note

This project is developed for educational and simulation purposes.
It does not process real money or real card data.

Card tokens and last-four-digit values are generated only for testing.
Authentication, authorization, idempotency and advanced concurrency
controls are planned as future improvements.
