import type { IndustryTemplate } from '../types';

export const industryTemplate: IndustryTemplate = {
  "key": "travel",
  "name": "Du lịch",
  "icon": "✈️",
  "description": "Tour du lịch trong và ngoài nước.",
  "category": "services",
  "websiteTypes": [
    "services",
    "landing"
  ],
  "saleMode": "contact",
  "productType": "physical",
  "businessType": "TravelAgency",
  "brandColor": "#db2777",
  "tags": [
    "du lịch",
    "tour",
    "khám phá"
  ],
  "assets": {
    "hero": [
      "/seed_mau/travel/hero/hero-1.jpg",
      "/seed_mau/travel/hero/hero-2.jpg"
    ],
    "products": [
      "/seed_mau/travel/products/product-1.jpg",
      "/seed_mau/travel/products/product-2.jpg",
      "/seed_mau/travel/products/product-3.jpg",
      "/seed_mau/travel/products/product-4.jpg"
    ],
    "posts": [
      "/seed_mau/travel/posts/post-1.jpg",
      "/seed_mau/travel/posts/post-2.jpg",
      "/seed_mau/travel/posts/post-3.jpg"
    ],
    "logos": [
      "/seed_mau/travel/logos/logo-1.png",
      "/seed_mau/travel/logos/logo-2.png",
      "/seed_mau/travel/logos/logo-3.png"
    ],
    "gallery": [
      "/seed_mau/travel/gallery/gallery-1.jpg",
      "/seed_mau/travel/gallery/gallery-2.jpg",
      "/seed_mau/travel/gallery/gallery-3.jpg",
      "/seed_mau/travel/gallery/gallery-4.jpg"
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
      "Tour trong nước",
      "Tour quốc tế",
      "Combo vé",
      "Khuyến mãi",
      "Dịch vụ"
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
      "du lịch",
      "tour",
      "khám phá"
    ],
    "customFields": {
      "item": [
        "Tour biển",
        "Tour núi",
        "Tour nước ngoài",
        "Combo vé",
        "Dịch vụ visa"
      ],
      "category": [
        "Tour trong nước",
        "Tour quốc tế",
        "Combo vé",
        "Khuyến mãi",
        "Dịch vụ"
      ],
      "brand": [
        "ProServe",
        "BizPro",
        "VietPro",
        "NovaCare",
        "Optima"
      ],
      "industry": [
        "Du lịch"
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
            "image": "/seed_mau/travel/hero/hero-1.jpg",
            "link": "/products"
          },
          {
            "image": "/seed_mau/travel/hero/hero-2.jpg",
            "link": "/products"
          }
        ],
        "content": {
          "badge": "Nổi bật",
          "heading": "Du lịch chất lượng",
          "description": "Tour du lịch trong và ngoài nước.",
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
        "heading": "Dịch vụ du lịch nổi bật",
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
        "heading": "Về Du lịch",
        "content": "Tour du lịch trong và ngoài nước.",
        "image": "/seed_mau/travel/gallery/gallery-1.jpg"
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
