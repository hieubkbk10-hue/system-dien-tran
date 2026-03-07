import { getConvexClient } from '@/lib/convex';
import { api } from '@/convex/_generated/api';
import { getSEOSettings, getSiteSettings } from '@/lib/get-settings';
import { parseHreflang } from '@/lib/seo';
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
      return {
        description: 'Trang sản phẩm hiện không khả dụng.',
        robots: { follow: false, index: false },
        title: 'Không tìm thấy sản phẩm',
      };
    }

    const [product, site, seo, saleModeSetting] = await Promise.all([
      client.query(api.products.getBySlug, { slug }),
      getSiteSettings(),
      getSEOSettings(),
      client.query(api.admin.modules.getModuleSetting, { moduleKey: 'products', settingKey: 'saleMode' }),
    ]);

    if (!product) {
      return {
        description: 'Sản phẩm này không tồn tại hoặc đã bị xóa.',
        title: 'Không tìm thấy sản phẩm',
      };
    }

    const baseUrl = (site.site_url || process.env.NEXT_PUBLIC_SITE_URL) ?? '';
    const title = product.metaTitle ?? product.name;
    const description = product.metaDescription ?? (product.description ? product.description.replaceAll(/<[^>]*>/g, '').slice(0, 160) : seo.seo_description);
    const image = (product.image ?? (product.images && product.images[0])) ?? seo.seo_og_image;
    const keywords = seo.seo_keywords ? seo.seo_keywords.split(',').map(k => k.trim()) : [];
    const languages = parseHreflang(seo.seo_hreflang);
    
    const saleModeValue = saleModeSetting?.value;
    const saleMode = saleModeValue === 'contact' || saleModeValue === 'affiliate' ? saleModeValue : 'cart';
    const formattedPrice = getPublicPriceLabel({
      saleMode,
      price: product.price,
      salePrice: product.salePrice,
    }).label;

    return {
      alternates: {
        canonical: `${baseUrl}/products/${product.slug}`,
        ...(Object.keys(languages).length > 0 && { languages }),
      },
      description,
      keywords,
      openGraph: {
        title,
        description,
        type: 'website',
        url: `${baseUrl}/products/${product.slug}`,
        images: image ? [{ url: image, alt: title }] : undefined,
        siteName: site.site_name,
        locale: site.site_language === 'vi' ? 'vi_VN' : 'en_US',
      },
      title,
      twitter: {
        card: 'summary_large_image',
        title: `${title} - ${formattedPrice}`,
        description,
        images: image ? [image] : undefined,
      },
    };
  } catch {
    return {
      description: 'Thông tin sản phẩm đang được cập nhật.',
      title: 'Sản phẩm',
    };
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
