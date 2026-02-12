import type { IndustryTemplate } from '../types';

export const industryTemplate: IndustryTemplate = {
  "key": "auto-parts",
  "name": "Phụ tùng ô tô",
  "icon": "🧰",
  "description": "Phụ tùng ô tô chính hãng, bảo hành rõ ràng.",
  "category": "retail",
  "websiteTypes": [
    "catalog",
    "ecommerce"
  ],
  "saleMode": "contact",
  "productType": "physical",
  "businessType": "AutoPartsStore",
  "brandColor": "#f97316",
  "tags": [
    "phụ tùng",
    "ô tô",
    "chính hãng"
  ],
  "assets": {
    "hero": [
      "/seed_mau/auto-parts/hero/1.webp",
      "/seed_mau/auto-parts/hero/10.webp",
      "/seed_mau/auto-parts/hero/11.webp",
      "/seed_mau/auto-parts/hero/12.webp",
      "/seed_mau/auto-parts/hero/13.webp",
      "/seed_mau/auto-parts/hero/14.webp",
      "/seed_mau/auto-parts/hero/15.webp",
      "/seed_mau/auto-parts/hero/16.webp",
      "/seed_mau/auto-parts/hero/17.webp",
      "/seed_mau/auto-parts/hero/2.webp",
      "/seed_mau/auto-parts/hero/3.webp",
      "/seed_mau/auto-parts/hero/4.webp",
      "/seed_mau/auto-parts/hero/5.webp",
      "/seed_mau/auto-parts/hero/6.webp",
      "/seed_mau/auto-parts/hero/7.webp",
      "/seed_mau/auto-parts/hero/8.webp",
      "/seed_mau/auto-parts/hero/9.webp"
    ],
    "products": [
      "/seed_mau/auto-parts/products/product-1.webp",
      "/seed_mau/auto-parts/products/product-2.webp",
      "/seed_mau/auto-parts/products/product-3.webp",
      "/seed_mau/auto-parts/products/product-4.webp"
    ],
    "posts": [
      "/seed_mau/auto-parts/posts/post-1.webp",
      "/seed_mau/auto-parts/posts/post-2.webp",
      "/seed_mau/auto-parts/posts/post-3.webp"
    ],
    "logos": [
      "/seed_mau/auto-parts/logos/logo-1.webp",
      "/seed_mau/auto-parts/logos/logo-2.webp",
      "/seed_mau/auto-parts/logos/logo-3.webp"
    ],
    "gallery": [
      "/seed_mau/auto-parts/gallery/gallery-1.webp",
      "/seed_mau/auto-parts/gallery/gallery-2.webp",
      "/seed_mau/auto-parts/gallery/gallery-3.webp",
      "/seed_mau/auto-parts/gallery/gallery-4.webp"
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
      "Động cơ",
      "Ngoại thất",
      "Nội thất",
      "Chăm sóc",
      "Phụ kiện"
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
      "phụ tùng",
      "ô tô",
      "chính hãng"
    ],
    "customFields": {
      "item": [
        "Lốp xe",
        "Ắc quy",
        "Đèn",
        "Phanh",
        "Dầu nhớt"
      ],
      "category": [
        "Động cơ",
        "Ngoại thất",
        "Nội thất",
        "Chăm sóc",
        "Phụ kiện"
      ],
      "brand": [
        "VietMart",
        "ZenHome",
        "Nova",
        "Lumia",
        "Sendo"
      ],
      "industry": [
        "Phụ tùng ô tô"
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
            "image": "/seed_mau/auto-parts/hero/1.webp",
            "link": "/products"
          },
          {
            "image": "/seed_mau/auto-parts/hero/10.webp",
            "link": "/products"
          }
        ],
        "content": {
          "badge": "Nổi bật",
          "heading": "Phụ tùng ô tô chất lượng",
          "description": "Phụ tùng ô tô chính hãng, bảo hành rõ ràng.",
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
        "heading": "Sản phẩm phụ tùng ô tô nổi bật",
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
        "heading": "Về Phụ tùng ô tô",
        "content": "Phụ tùng ô tô chính hãng, bảo hành rõ ràng.",
        "image": "/seed_mau/auto-parts/gallery/gallery-1.webp"
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
