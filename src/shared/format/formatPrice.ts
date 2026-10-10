const tengeFormatter = new Intl.NumberFormat("ru-KZ", {
  style: "currency",
  currency: "KZT",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export const formatPrice = (price: number) => tengeFormatter.format(price);
