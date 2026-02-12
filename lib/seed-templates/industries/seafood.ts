import type { IndustryTemplate } from '../types';

export const industryTemplate: IndustryTemplate = {
  "key": "seafood",
  "name": "Hải sản",
  "icon": "🦐",
  "description": "Hải sản tươi sống, đóng gói chuẩn.",
  "category": "food-beverage",
  "websiteTypes": [
    "catalog",
    "ecommerce"
  ],
  "saleMode": "cart",
  "productType": "physical",
  "businessType": "Store",
  "brandColor": "#f97316",
  "tags": [
    "hải sản",
    "tươi sống",
    "đặc sản"
  ],
  "assets": {
    "hero": [
      "/seed_mau/seafood/hero/hero-1.webp",
      "/seed_mau/seafood/hero/hero-2.webp"
    ],
    "products": [
      "/seed_mau/seafood/products/product-1.webp",
      "/seed_mau/seafood/products/product-2.webp",
      "/seed_mau/seafood/products/product-3.webp",
      "/seed_mau/seafood/products/product-4.webp"
    ],
    "posts": [
      "/seed_mau/seafood/posts/post-1.webp",
      "/seed_mau/seafood/posts/post-2.webp",
      "/seed_mau/seafood/posts/post-3.webp"
    ],
    "logos": [
      "/seed_mau/seafood/logos/logo-1.webp",
      "/seed_mau/seafood/logos/logo-2.webp",
      "/seed_mau/seafood/logos/logo-3.webp"
    ],
    "gallery": [
      "/seed_mau/seafood/gallery/gallery-1.webp",
      "/seed_mau/seafood/gallery/gallery-2.webp",
      "/seed_mau/seafood/gallery/gallery-3.webp",
      "/seed_mau/seafood/gallery/gallery-4.webp"
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
      "Hải sản tươi",
      "Hải sản đông lạnh",
      "Combo",
      "Gia vị",
      "Đặc sản"
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
      "hải sản",
      "tươi sống",
      "đặc sản"
    ],
    "customFields": {
      "item": [
        "Tôm hùm",
        "Cua",
        "Cá hồi",
        "Mực",
        "Nghêu"
      ],
      "category": [
        "Hải sản tươi",
        "Hải sản đông lạnh",
        "Combo",
        "Gia vị",
        "Đặc sản"
      ],
      "brand": [
        "Freshy",
        "Foodie",
        "Daily",
        "GreenBite",
        "Ocean"
      ],
      "industry": [
        "Hải sản"
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
            "image": "/seed_mau/seafood/hero/hero-1.webp",
            "link": "/products"
          },
          {
            "image": "/seed_mau/seafood/hero/hero-2.webp",
            "link": "/products"
          }
        ],
        "content": {
          "badge": "Nổi bật",
          "heading": "Hải sản chất lượng",
          "description": "Hải sản tươi sống, đóng gói chuẩn.",
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
        "heading": "Sản phẩm hải sản nổi bật",
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
        "heading": "Về Hải sản",
        "content": "Hải sản tươi sống, đóng gói chuẩn.",
        "image": "/seed_mau/seafood/gallery/gallery-1.webp"
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
