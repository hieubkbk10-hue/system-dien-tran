export type ProductSaleMode = 'cart' | 'contact' | 'affiliate';

const formatVnd = (price: number) =>
  new Intl.NumberFormat('vi-VN', { currency: 'VND', style: 'currency' }).format(price);

export function getPublicPriceLabel({
  saleMode,
  price,
  salePrice,
}: {
  saleMode: ProductSaleMode;
  price?: number;
  salePrice?: number;
}) {
  const effectivePrice = salePrice ?? price ?? 0;
  const isContactPrice = saleMode !== 'cart' && (!effectivePrice || effectivePrice <= 0);
  return {
    label: isContactPrice ? 'Giá liên hệ' : formatVnd(effectivePrice),
    comparePrice: !isContactPrice && salePrice && price && salePrice < price ? price : undefined,
    effectivePrice,
    isContactPrice,
  };
}
