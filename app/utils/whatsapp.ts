// wa.me needs the full international number without "+" or spaces. Local Zambian numbers start
// with 0 (e.g. 0977 123456), so swap that for the 260 country code.
export function whatsappLink(number: string) {
  const digits = number.replace(/\D/g, '')
  const international = digits.startsWith('0') ? `260${digits.slice(1)}` : digits
  return `https://wa.me/${international}`
}
