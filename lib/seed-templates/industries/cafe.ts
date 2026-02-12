import type { IndustryTemplate } from '../types';

export const industryTemplate: IndustryTemplate = {
  "key": "cafe",
  "name": "Quán cà phê",
  "icon": "☕",
  "description": "Cà phê rang xay, đồ uống sáng tạo.",
  "category": "food-beverage",
  "websiteTypes": [
    "services",
    "landing"
  ],
  "saleMode": "contact",
  "productType": "physical",
  "businessType": "CafeOrCoffeeShop",
  "brandColor": "#dc2626",
  "tags": [
    "cà phê",
    "đồ uống",
    "chill"
  ],
  "assets": {
    "hero": [
      "/seed_mau/cafe/hero/hero-1.webp",
      "/seed_mau/cafe/hero/hero-2.webp"
    ],
    "products": [
      "/seed_mau/cafe/products/product-1.webp",
      "/seed_mau/cafe/products/product-2.webp",
      "/seed_mau/cafe/products/product-3.webp",
      "/seed_mau/cafe/products/product-4.webp"
    ],
    "posts": [
      "/seed_mau/cafe/posts/post-1.webp",
      "/seed_mau/cafe/posts/post-2.webp",
      "/seed_mau/cafe/posts/post-3.webp"
    ],
    "logos": [
      "/seed_mau/cafe/logos/logo-1.webp",
      "/seed_mau/cafe/logos/logo-2.webp",
      "/seed_mau/cafe/logos/logo-3.webp"
    ],
    "gallery": [
      "/seed_mau/cafe/gallery/gallery-1.webp",
      "/seed_mau/cafe/gallery/gallery-2.webp",
      "/seed_mau/cafe/gallery/gallery-3.webp",
      "/seed_mau/cafe/gallery/gallery-4.webp"
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
      "Cà phê",
      "Trà",
      "Đá xay",
      "Bánh ngọt",
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
      "cà phê",
      "đồ uống",
      "chill"
    ],
    "customFields": {
      "item": [
        "Cà phê pha máy",
        "Cold brew",
        "Trà trái cây",
        "Bánh ngọt",
        "Combo sáng"
      ],
      "category": [
        "Cà phê",
        "Trà",
        "Đá xay",
        "Bánh ngọt",
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
        "Quán cà phê"
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
            "image": "/seed_mau/cafe/hero/hero-1.webp",
            "link": "/products"
          },
          {
            "image": "/seed_mau/cafe/hero/hero-2.webp",
            "link": "/products"
          }
        ],
        "content": {
          "badge": "Nổi bật",
          "heading": "Quán cà phê chất lượng",
          "description": "Cà phê rang xay, đồ uống sáng tạo.",
          "primaryButtonText": "Khám phá ngay",
          "secondaryButtonText": "Tìm hiểu thêm"
        }
      }
    },
    {
      "type": "ServiceList",
      "title": "Dịch vụ nổi bật",
      "order": 1,
      "active": true,
      "config": {
        "heading": "Dịch vụ quán cà phê nổi bật",
        "subheading": "Chọn gói phù hợp nhất",
        "limit": 6,
        "showButton": true
      }
    },
    {
      "type": "About",
      "title": "Giới thiệu",
      "order": 2,
      "active": true,
      "config": {
        "heading": "Về Quán cà phê",
        "content": "Cà phê rang xay, đồ uống sáng tạo.",
        "image": "/seed_mau/cafe/gallery/gallery-1.webp"
      }
    },
    {
      "type": "CTA",
      "title": "CTA",
      "order": 3,
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
      "order": 4,
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
      "order": 5,
      "active": true,
      "config": {
        "style": "classic"
      }
    }
  ],
  "experiencePresetKey": "professional"
};

export default industryTemplate;
