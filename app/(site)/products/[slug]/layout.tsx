import { getConvexClient } from '@/lib/convex';
import { api } from '@/convex/_generated/api';
import { getSEOSettings, getSiteSettings } from '@/lib/get-settings';
import { buildCanonicalUrl, buildMetadata, buildSeoContext } from '@/lib/seo/metadata';
import { stripHtml, truncateText } from '@/lib/seo';
import { JsonLd, generateBreadcrumbSchema, generateProductSchema } from '@/components/seo/JsonLd';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublicPriceLabel } from '@/lib/products/public-price';

interface Props {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const client = getConvexClient();
  try {
    const productsModule = await client.query(api.admin.modules.getModuleByKey, { key: 'products' });
    if (productsModule?.enabled === false) {
      const [site, seo] = await Promise.all([
        getSiteSettings(),
        getSEOSettings(),
      ]);
      const context = buildSeoContext(site, seo);
      return buildMetadata({
        context,
        description: 'Trang sản phẩm hiện không khả dụng.',
        indexable: false,
        title: 'Không tìm thấy sản phẩm',
      });
    }

    const [product, site, seo, saleModeSetting] = await Promise.all([
      client.query(api.products.getBySlug, { slug }),
      getSiteSettings(),
      getSEOSettings(),
      client.query(api.admin.modules.getModuleSetting, { moduleKey: 'products', settingKey: 'saleMode' }),
    ]);

    if (!product) {
      const context = buildSeoContext(site, seo);
      return buildMetadata({
        context,
        description: 'Sản phẩm này không tồn tại hoặc đã bị xóa.',
        indexable: false,
        title: 'Không tìm thấy sản phẩm',
      });
    }

    const context = buildSeoContext(site, seo);
    const title = product.metaTitle ?? product.name;
    const description = product.metaDescription
      ?? (product.description ? truncateText(stripHtml(product.description), 160) : '')
      ?? seo.seo_description;
    const image = (product.image ?? (product.images && product.images[0])) ?? context.image;
    
    const saleModeValue = saleModeSetting?.value;
    const saleMode = saleModeValue === 'contact' || saleModeValue === 'affiliate' ? saleModeValue : 'cart';
    const formattedPrice = getPublicPriceLabel({
      saleMode,
      price: product.price,
      salePrice: product.salePrice,
    }).label;

    return buildMetadata({
      canonical: buildCanonicalUrl(context.baseUrl, `/products/${product.slug}`),
      context,
      description: description || context.description,
      image,
      indexable: true,
      title: `${title} - ${formattedPrice}`,
    });
  } catch {
    const [site, seo] = await Promise.all([
      getSiteSettings(),
      getSEOSettings(),
    ]);
    const context = buildSeoContext(site, seo);
    return buildMetadata({
      context,
      description: 'Thông tin sản phẩm đang được cập nhật.',
      indexable: false,
      title: 'Sản phẩm',
    });
  }
}

export default async function ProductLayout({ params, children }: Props) {
  const { slug } = await params;
  const client = getConvexClient();
  try {
    const productsModule = await client.query(api.admin.modules.getModuleByKey, { key: 'products' });
    if (productsModule?.enabled === false) {
      notFound();
    }

    const [product, site, seo, enabledFields] = await Promise.all([
      client.query(api.products.getBySlug, { slug }),
      getSiteSettings(),
      getSEOSettings(),
      client.query(api.admin.modules.listEnabledModuleFields, { moduleKey: 'products' }),
    ]);

    if (!product) {return children;}

    const baseUrl = (site.site_url || process.env.NEXT_PUBLIC_SITE_URL) ?? '';
    const productUrl = `${baseUrl}/products/${product.slug}`;
    const image = (product.image ?? (product.images && product.images[0])) ?? seo.seo_og_image;

    const ratingSummary = await client.query(api.comments.getRatingSummary, {
      targetId: product._id,
      targetType: 'product',
    });

    const showStock = enabledFields ? enabledFields.some((field) => field.fieldKey === 'stock') : true;

    const productSchema = generateProductSchema({
      aggregateRating: ratingSummary.count > 0
        ? { ratingValue: Number(ratingSummary.average.toFixed(2)), reviewCount: ratingSummary.count }
        : undefined,
      brand: site.site_name,
      description: (product.metaDescription ?? product.description?.replace(/<[^>]*>/g, '').slice(0, 160)) ?? seo.seo_description,
      image,
      inStock: showStock ? product.stock > 0 : true,
      name: product.metaTitle ?? product.name,
      price: product.price,
      salePrice: product.salePrice,
      sku: product.sku,
      url: productUrl,
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: 'Trang chủ', url: baseUrl },
      { name: 'Sản phẩm', url: `${baseUrl}/products` },
      { name: product.name, url: productUrl },
    ]);

    return (
      <>
        <JsonLd data={productSchema} />
        <JsonLd data={breadcrumbSchema} />
        {children}
      </>
    );
  } catch {
    return children;
  }
}
