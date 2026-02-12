import type { IndustryTemplate } from '../types';

export const industryTemplate: IndustryTemplate = {
  "key": "multi-category",
  "name": "Siêu thị tổng hợp",
  "icon": "🛒",
  "description": "Đa dạng ngành hàng, mua sắm một điểm.",
  "category": "retail",
  "websiteTypes": [
    "catalog",
    "ecommerce"
  ],
  "saleMode": "cart",
  "productType": "physical",
  "businessType": "Store",
  "brandColor": "#2563eb",
  "tags": [
    "siêu thị",
    "đa ngành",
    "tiện lợi"
  ],
  "assets": {
    "hero": [
      "/seed_mau/multi-category/hero/hero-1.jpg",
      "/seed_mau/multi-category/hero/hero-2.jpg"
    ],
    "products": [
      "/seed_mau/multi-category/products/product-1.jpg",
      "/seed_mau/multi-category/products/product-2.jpg",
      "/seed_mau/multi-category/products/product-3.jpg",
      "/seed_mau/multi-category/products/product-4.jpg"
    ],
    "posts": [
      "/seed_mau/multi-category/posts/post-1.jpg",
      "/seed_mau/multi-category/posts/post-2.jpg",
      "/seed_mau/multi-category/posts/post-3.jpg"
    ],
    "logos": [
      "/seed_mau/multi-category/logos/logo-1.png",
      "/seed_mau/multi-category/logos/logo-2.png",
      "/seed_mau/multi-category/logos/logo-3.png"
    ],
    "gallery": [
      "/seed_mau/multi-category/gallery/gallery-1.jpg",
      "/seed_mau/multi-category/gallery/gallery-2.jpg",
      "/seed_mau/multi-category/gallery/gallery-3.jpg",
      "/seed_mau/multi-category/gallery/gallery-4.jpg"
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
      "Gia dụng",
      "Thực phẩm",
      "Chăm sóc",
      "Điện tử",
      "Khuyến mãi"
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
      "siêu thị",
      "đa ngành",
      "tiện lợi"
    ],
    "customFields": {
      "item": [
        "Hàng tiêu dùng",
        "Gia dụng",
        "Thực phẩm",
        "Chăm sóc cá nhân",
        "Đồ điện"
      ],
      "category": [
        "Gia dụng",
        "Thực phẩm",
        "Chăm sóc",
        "Điện tử",
        "Khuyến mãi"
      ],
      "brand": [
        "VietMart",
        "ZenHome",
        "Nova",
        "Lumia",
        "Sendo"
      ],
      "industry": [
        "Siêu thị tổng hợp"
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
            "image": "/seed_mau/multi-category/hero/hero-1.jpg",
            "link": "/products"
          },
          {
            "image": "/seed_mau/multi-category/hero/hero-2.jpg",
            "link": "/products"
          }
        ],
        "content": {
          "badge": "Nổi bật",
          "heading": "Siêu thị tổng hợp chất lượng",
          "description": "Đa dạng ngành hàng, mua sắm một điểm.",
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
        "heading": "Sản phẩm siêu thị tổng hợp nổi bật",
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
        "heading": "Về Siêu thị tổng hợp",
        "content": "Đa dạng ngành hàng, mua sắm một điểm.",
        "image": "/seed_mau/multi-category/gallery/gallery-1.jpg"
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
