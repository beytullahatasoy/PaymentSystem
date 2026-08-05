export function formatMoney(
    amountMinor: number,
    currency: string,
): string {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency,
    }).format(amountMinor / 100);
}