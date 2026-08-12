export const PRICING = {
  IN: { currency: "₹", currencyCode: "INR", monthly: 149, yearly: 999 },

  US: { currency: "$", currencyCode: "USD", monthly: 4.99, yearly: 29.99 },
  CA: { currency: "C$", currencyCode: "CAD", monthly: 5.99, yearly: 39.99 },
  GB: { currency: "£", currencyCode: "GBP", monthly: 3.99, yearly: 24.99 },

  DE: { currency: "€", currencyCode: "EUR", monthly: 4.99, yearly: 29.99 },
  FR: { currency: "€", currencyCode: "EUR", monthly: 4.99, yearly: 29.99 },
  IT: { currency: "€", currencyCode: "EUR", monthly: 4.99, yearly: 29.99 },
  ES: { currency: "€", currencyCode: "EUR", monthly: 4.99, yearly: 29.99 },
  NL: { currency: "€", currencyCode: "EUR", monthly: 4.99, yearly: 29.99 },
  BE: { currency: "€", currencyCode: "EUR", monthly: 4.99, yearly: 29.99 },

  SG: { currency: "S$", currencyCode: "SGD", monthly: 5.99, yearly: 39.99 },
  MY: { currency: "RM", currencyCode: "MYR", monthly: 19.90, yearly: 129.90 },
  TH: { currency: "฿", currencyCode: "THB", monthly: 149, yearly: 999 },
  ID: { currency: "Rp", currencyCode: "IDR", monthly: 79000, yearly: 499000 },
  PH: { currency: "₱", currencyCode: "PHP", monthly: 249, yearly: 1499 },
  VN: { currency: "₫", currencyCode: "VND", monthly: 99000, yearly: 699000 },
  JP: { currency: "¥", currencyCode: "JPY", monthly: 700, yearly: 4900 },
  KR: { currency: "₩", currencyCode: "KRW", monthly: 5900, yearly: 39900 },
  HK: { currency: "HK$", currencyCode: "HKD", monthly: 39, yearly: 249 },
  TW: { currency: "NT$", currencyCode: "TWD", monthly: 149, yearly: 999 },

  CN: { currency: "¥", currencyCode: "CNY", monthly: 35, yearly: 199 },

  AE: { currency: "AED", currencyCode: "AED", monthly: 19.99, yearly: 129.99 },
  SA: { currency: "SAR", currencyCode: "SAR", monthly: 18.99, yearly: 119.99 },

  AU: { currency: "A$", currencyCode: "AUD", monthly: 7.99, yearly: 49.99 },
  NZ: { currency: "NZ$", currencyCode: "NZD", monthly: 8.99, yearly: 54.99 },
} as const

export function getPricing(country = "IN") {
  const normalizedCountry = country.trim().toUpperCase()

  return (
    PRICING[normalizedCountry as keyof typeof PRICING] ||
    PRICING.IN
  )
}
