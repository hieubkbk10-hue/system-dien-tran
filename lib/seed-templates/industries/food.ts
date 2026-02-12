import type { IndustryTemplate } from '../types';

export const industryTemplate: IndustryTemplate = {
  "key": "food",
  "name": "Thực phẩm",
  "icon": "🥗",
  "description": "Thực phẩm sạch, giao nhanh trong ngày.",
  "category": "food-beverage",
  "websiteTypes": [
    "catalog",
    "ecommerce"
  ],
  "saleMode": "cart",
  "productType": "physical",
  "businessType": "FoodEstablishment",
  "brandColor": "#16a34a",
  "tags": [
    "thực phẩm",
    "tươi sạch",
    "giao nhanh"
  ],
  "assets": {
    "hero": [
      "/seed_mau/food/hero/hero-1.webp",
      "/seed_mau/food/hero/hero-2.webp"
    ],
    "products": [
      "/seed_mau/food/products/product-1.webp",
      "/seed_mau/food/products/product-2.webp",
      "/seed_mau/food/products/product-3.webp",
      "/seed_mau/food/products/product-4.webp"
    ],
    "posts": [
      "/seed_mau/food/posts/post-1.webp",
      "/seed_mau/food/posts/post-2.webp",
      "/seed_mau/food/posts/post-3.webp"
    ],
    "logos": [
      "/seed_mau/food/logos/logo-1.webp",
      "/seed_mau/food/logos/logo-2.webp",
      "/seed_mau/food/logos/logo-3.webp"
    ],
    "gallery": [
      "/seed_mau/food/gallery/gallery-1.webp",
      "/seed_mau/food/gallery/gallery-2.webp",
      "/seed_mau/food/gallery/gallery-3.webp",
      "/seed_mau/food/gallery/gallery-4.webp"
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
      "Rau củ",
      "Thịt",
      "Hải sản",
      "Đặc sản",
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
      "thực phẩm",
      "tươi sạch",
      "giao nhanh"
    ],
    "customFields": {
      "item": [
        "Rau củ",
        "Thịt tươi",
        "Hải sản",
        "Trái cây",
        "Gia vị"
      ],
      "category": [
        "Rau củ",
        "Thịt",
        "Hải sản",
        "Đặc sản",
        "Combo"
      ],
      "brand": [
        "Freshy",
        "Foodie",
        "Daily",
        "GreenBite",
        "Ocean"
      ],
      "industry": [
        "Thực phẩm"
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
            "image": "/seed_mau/food/hero/hero-1.webp",
            "link": "/products"
          },
          {
            "image": "/seed_mau/food/hero/hero-2.webp",
            "link": "/products"
          }
        ],
        "content": {
          "badge": "Nổi bật",
          "heading": "Thực phẩm chất lượng",
          "description": "Thực phẩm sạch, giao nhanh trong ngày.",
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
        "heading": "Sản phẩm thực phẩm nổi bật",
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
        "heading": "Về Thực phẩm",
        "content": "Thực phẩm sạch, giao nhanh trong ngày.",
        "image": "/seed_mau/food/gallery/gallery-1.webp"
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
