export const FREE_SHIPPING_THRESHOLD = 120;

export const deliveryOptions = [
  { id: "standard", label: "Standard delivery", eta: "3–5 business days", cost: 18 },
  { id: "express", label: "Express delivery", eta: "1–2 business days", cost: 29 },
] as const;

export type DeliveryId = (typeof deliveryOptions)[number]["id"];

export const coupons: Record<string, { percent: number; label: string }> = {
  NORTHSTAR10: { percent: 10, label: "10% off your order" },
};

export function shippingFor(subtotal: number, delivery: DeliveryId) {
  const option = deliveryOptions.find((item) => item.id === delivery) ?? deliveryOptions[0];
  if (delivery === "standard" && subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return option.cost;
}

export function discountFor(subtotal: number, code: string) {
  const coupon = coupons[code.trim().toUpperCase()];
  return coupon ? Math.round(subtotal * coupon.percent) / 100 : 0;
}

export const money = (value: number) => `$${value.toFixed(2)}`;
