import type { IndustryTemplate } from '../types';

export const industryTemplate: IndustryTemplate = {
  "key": "books",
  "name": "Sách",
  "icon": "📚",
  "description": "Sách kỹ năng, văn học, thiếu nhi.",
  "category": "retail",
  "websiteTypes": [
    "catalog",
    "ecommerce"
  ],
  "saleMode": "cart",
  "productType": "physical",
  "businessType": "BookStore",
  "brandColor": "#db2777",
  "tags": [
    "sách",
    "tri thức",
    "giáo dục"
  ],
  "assets": {
    "hero": [
      "/seed_mau/books/hero/hero-1.webp",
      "/seed_mau/books/hero/hero-2.webp"
    ],
    "products": [
      "/seed_mau/books/products/product-1.webp",
      "/seed_mau/books/products/product-2.webp",
      "/seed_mau/books/products/product-3.webp",
      "/seed_mau/books/products/product-4.webp"
    ],
    "posts": [
      "/seed_mau/books/posts/post-1.webp",
      "/seed_mau/books/posts/post-2.webp",
      "/seed_mau/books/posts/post-3.webp"
    ],
    "logos": [
      "/seed_mau/books/logos/logo-1.webp",
      "/seed_mau/books/logos/logo-2.webp",
      "/seed_mau/books/logos/logo-3.webp"
    ],
    "gallery": [
      "/seed_mau/books/gallery/gallery-1.webp",
      "/seed_mau/books/gallery/gallery-2.webp",
      "/seed_mau/books/gallery/gallery-3.webp",
      "/seed_mau/books/gallery/gallery-4.webp"
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
      "Kỹ năng",
      "Văn học",
      "Thiếu nhi",
      "Kinh doanh",
      "Combo"
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
      "sách",
      "tri thức",
      "giáo dục"
    ],
    "customFields": {
      "item": [
        "Sách kỹ năng",
        "Văn học",
        "Thiếu nhi",
        "Kinh doanh",
        "Combo"
      ],
      "category": [
        "Kỹ năng",
        "Văn học",
        "Thiếu nhi",
        "Kinh doanh",
        "Combo"
      ],
      "brand": [
        "VietMart",
        "ZenHome",
        "Nova",
        "Lumia",
        "Sendo"
      ],
      "industry": [
        "Sách"
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
            "image": "/seed_mau/books/hero/hero-1.webp",
            "link": "/products"
          },
          {
            "image": "/seed_mau/books/hero/hero-2.webp",
            "link": "/products"
          }
        ],
        "content": {
          "badge": "Nổi bật",
          "heading": "Sách chất lượng",
          "description": "Sách kỹ năng, văn học, thiếu nhi.",
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
        "heading": "Sản phẩm sách nổi bật",
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
        "heading": "Về Sách",
        "content": "Sách kỹ năng, văn học, thiếu nhi.",
        "image": "/seed_mau/books/gallery/gallery-1.webp"
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
