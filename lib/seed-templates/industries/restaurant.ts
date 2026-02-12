import type { IndustryTemplate } from '../types';

export const industryTemplate: IndustryTemplate = {
  "key": "restaurant",
  "name": "Nhà hàng",
  "icon": "🍽️",
  "description": "Thực đơn theo ngày, đặt bàn nhanh chóng.",
  "category": "food-beverage",
  "websiteTypes": [
    "services",
    "landing"
  ],
  "saleMode": "contact",
  "productType": "physical",
  "businessType": "Restaurant",
  "brandColor": "#2563eb",
  "tags": [
    "nhà hàng",
    "thực đơn",
    "đặt bàn"
  ],
  "assets": {
    "hero": [
      "/seed_mau/restaurant/hero/hero-1.webp",
      "/seed_mau/restaurant/hero/hero-2.webp"
    ],
    "products": [
      "/seed_mau/restaurant/products/product-1.webp",
      "/seed_mau/restaurant/products/product-2.webp",
      "/seed_mau/restaurant/products/product-3.webp",
      "/seed_mau/restaurant/products/product-4.webp"
    ],
    "posts": [
      "/seed_mau/restaurant/posts/post-1.webp",
      "/seed_mau/restaurant/posts/post-2.webp",
      "/seed_mau/restaurant/posts/post-3.webp"
    ],
    "logos": [
      "/seed_mau/restaurant/logos/logo-1.webp",
      "/seed_mau/restaurant/logos/logo-2.webp",
      "/seed_mau/restaurant/logos/logo-3.webp"
    ],
    "gallery": [
      "/seed_mau/restaurant/gallery/gallery-1.webp",
      "/seed_mau/restaurant/gallery/gallery-2.webp",
      "/seed_mau/restaurant/gallery/gallery-3.webp",
      "/seed_mau/restaurant/gallery/gallery-4.webp"
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
      "Set menu",
      "Món chính",
      "Món chay",
      "Đồ uống",
      "Tráng miệng"
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
      "nhà hàng",
      "thực đơn",
      "đặt bàn"
    ],
    "customFields": {
      "item": [
        "Set menu",
        "Món khai vị",
        "Món chính",
        "Món tráng miệng",
        "Rượu vang"
      ],
      "category": [
        "Set menu",
        "Món chính",
        "Món chay",
        "Đồ uống",
        "Tráng miệng"
      ],
      "brand": [
        "Freshy",
        "Foodie",
        "Daily",
        "GreenBite",
        "Ocean"
      ],
      "industry": [
        "Nhà hàng"
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
            "image": "/seed_mau/restaurant/hero/hero-1.webp",
            "link": "/products"
          },
          {
            "image": "/seed_mau/restaurant/hero/hero-2.webp",
            "link": "/products"
          }
        ],
        "content": {
          "badge": "Nổi bật",
          "heading": "Nhà hàng chất lượng",
          "description": "Thực đơn theo ngày, đặt bàn nhanh chóng.",
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
        "heading": "Dịch vụ nhà hàng nổi bật",
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
        "heading": "Về Nhà hàng",
        "content": "Thực đơn theo ngày, đặt bàn nhanh chóng.",
        "image": "/seed_mau/restaurant/gallery/gallery-1.webp"
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
