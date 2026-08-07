/** Formats a price as Indian Rupees with Indian-style digit grouping
 * (e.g. ₹1,499 or ₹12,499.50), matching the currency buyers/sellers on
 * this platform actually use. */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: price % 1 === 0 ? 0 : 2,
  }).format(price);
}
