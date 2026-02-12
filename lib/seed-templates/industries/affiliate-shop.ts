import type { IndustryTemplate } from '../types';

export const industryTemplate: IndustryTemplate = {
  "key": "affiliate-shop",
  "name": "Affiliate Shop",
  "icon": "🧩",
  "description": "Danh mục sản phẩm tiếp thị liên kết.",
  "category": "retail",
  "websiteTypes": [
    "catalog",
    "ecommerce"
  ],
  "saleMode": "affiliate",
  "productType": "physical",
  "businessType": "Store",
  "brandColor": "#4f46e5",
  "tags": [
    "affiliate",
    "tiếp thị",
    "deal"
  ],
  "assets": {
    "hero": [
      "/seed_mau/affiliate-shop/hero/hero-1.webp",
      "/seed_mau/affiliate-shop/hero/hero-2.webp"
    ],
    "products": [
      "/seed_mau/affiliate-shop/products/product-1.webp",
      "/seed_mau/affiliate-shop/products/product-2.webp",
      "/seed_mau/affiliate-shop/products/product-3.webp",
      "/seed_mau/affiliate-shop/products/product-4.webp"
    ],
    "posts": [
      "/seed_mau/affiliate-shop/posts/post-1.webp",
      "/seed_mau/affiliate-shop/posts/post-2.webp",
      "/seed_mau/affiliate-shop/posts/post-3.webp"
    ],
    "logos": [
      "/seed_mau/affiliate-shop/logos/logo-1.webp",
      "/seed_mau/affiliate-shop/logos/logo-2.webp",
      "/seed_mau/affiliate-shop/logos/logo-3.webp"
    ],
    "gallery": [
      "/seed_mau/affiliate-shop/gallery/gallery-1.webp",
      "/seed_mau/affiliate-shop/gallery/gallery-2.webp",
      "/seed_mau/affiliate-shop/gallery/gallery-3.webp",
      "/seed_mau/affiliate-shop/gallery/gallery-4.webp"
    ]
  },
  "fakerTemplates": {
    "namePatterns": [
      "{{item}} {{variant}}",
      "{{brand}} {{item}}",
      "{{item}} {{feature}}"
    ],
    "descriptionPatterns": [
      "{{description}} {{feature}} phù hợp cho {{usage}}.",
      "{{description}} Thiết kế {{feature}} dành cho {{usage}}."
    ],
    "postTitlePatterns": [
      "Bí quyết chọn {{item}} phù hợp",
      "Top {{number}} {{item}} đáng mua {{year}}",
      "Kinh nghiệm sử dụng {{item}}",
      "Xu hướng {{industry}} {{year}}"
    ],
    "postExcerptPatterns": [
      "Tổng hợp xu hướng mới, gợi ý lựa chọn phù hợp nhu cầu.",
      "Chia sẻ kinh nghiệm thực tế và mẹo tối ưu."
    ],
    "serviceNamePatterns": [
      "Gói {{industry}} {{variant}}",
      "Tư vấn {{industry}}",
      "Dịch vụ {{industry}} {{feature}}"
    ],
    "categoryNames": [
      "Hot deals",
      "Best sellers",
      "Top rating",
      "Combo",
      "Flash sale"
    ],
    "postCategoryNames": [
      "Tin tức",
      "Hướng dẫn",
      "Khuyến mãi",
      "Kinh nghiệm",
      "Hỏi đáp"
    ],
    "serviceCategoryNames": [
      "Tư vấn",
      "Triển khai",
      "Bảo trì",
      "Đào tạo",
      "Tùy chỉnh"
    ],
    "tags": [
      "affiliate",
      "tiếp thị",
      "deal"
    ],
    "customFields": {
      "item": [
        "Đồ gia dụng",
        "Thiết bị công nghệ",
        "Thời trang",
        "Làm đẹp",
        "Sức khỏe"
      ],
      "category": [
        "Hot deals",
        "Best sellers",
        "Top rating",
        "Combo",
        "Flash sale"
      ],
      "brand": [
        "VietMart",
        "ZenHome",
        "Nova",
        "Lumia",
        "Sendo"
      ],
      "industry": [
        "Affiliate Shop"
      ]
    }
  },
  "homeComponents": [
    {
      "type": "Hero",
      "title": "Hero Banner",
      "order": 0,
      "active": true,
      "config": {
        "style": "slider",
        "slides": [
          {
            "image": "/seed_mau/affiliate-shop/hero/hero-1.webp",
            "link": "/products"
          },
          {
            "image": "/seed_mau/affiliate-shop/hero/hero-2.webp",
            "link": "/products"
          }
        ],
        "content": {
          "badge": "Nổi bật",
          "heading": "Affiliate Shop chất lượng",
          "description": "Danh mục sản phẩm tiếp thị liên kết.",
          "primaryButtonText": "Khám phá ngay",
          "secondaryButtonText": "Tìm hiểu thêm"
        }
      }
    },
    {
      "type": "ProductCategories",
      "title": "Danh mục sản phẩm",
      "order": 1,
      "active": true,
      "config": {
        "categories": [],
        "columnsDesktop": 4,
        "columnsMobile": 2,
        "showProductCount": true,
        "style": "grid"
      }
    },
    {
      "type": "ProductList",
      "title": "Sản phẩm nổi bật",
      "order": 2,
      "active": true,
      "config": {
        "heading": "Sản phẩm affiliate shop nổi bật",
        "subheading": "Gợi ý sản phẩm bán chạy",
        "limit": 8,
        "showButton": true,
        "showPrice": true
      }
    },
    {
      "type": "About",
      "title": "Giới thiệu",
      "order": 3,
      "active": true,
      "config": {
        "heading": "Về Affiliate Shop",
        "content": "Danh mục sản phẩm tiếp thị liên kết.",
        "image": "/seed_mau/affiliate-shop/gallery/gallery-1.webp"
      }
    },
    {
      "type": "CTA",
      "title": "CTA",
      "order": 4,
      "active": true,
      "config": {
        "heading": "Sẵn sàng bắt đầu?",
        "description": "Liên hệ để nhận tư vấn nhanh.",
        "buttonText": "Liên hệ ngay",
        "buttonLink": "/lien-he"
      }
    },
    {
      "type": "Contact",
      "title": "Liên hệ",
      "order": 5,
      "active": true,
      "config": {
        "heading": "Liên hệ với chúng tôi",
        "subheading": "Đội ngũ hỗ trợ 24/7",
        "showForm": true,
        "showMap": false
      }
    },
    {
      "type": "Footer",
      "title": "Footer",
      "order": 6,
      "active": true,
      "config": {
        "style": "classic"
      }
    }
  ],
  "experiencePresetKey": "modern"
};

export default industryTemplate;
