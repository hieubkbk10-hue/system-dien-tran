import type { IndustryTemplate } from '../types';

export const industryTemplate: IndustryTemplate = {
  "key": "massage",
  "name": "Massage",
  "icon": "🧖",
  "description": "Massage thư giãn, trị liệu chuyên nghiệp.",
  "category": "health-wellness",
  "websiteTypes": [
    "services",
    "landing"
  ],
  "saleMode": "contact",
  "productType": "physical",
  "businessType": "HealthAndBeautyBusiness",
  "brandColor": "#d97706",
  "tags": [
    "massage",
    "thư giãn",
    "trị liệu"
  ],
  "assets": {
    "hero": [
      "/seed_mau/massage/hero/hero-1.webp",
      "/seed_mau/massage/hero/hero-2.webp"
    ],
    "products": [
      "/seed_mau/massage/products/product-1.webp",
      "/seed_mau/massage/products/product-2.webp",
      "/seed_mau/massage/products/product-3.webp",
      "/seed_mau/massage/products/product-4.webp"
    ],
    "posts": [
      "/seed_mau/massage/posts/post-1.webp",
      "/seed_mau/massage/posts/post-2.webp",
      "/seed_mau/massage/posts/post-3.webp"
    ],
    "logos": [
      "/seed_mau/massage/logos/logo-1.webp",
      "/seed_mau/massage/logos/logo-2.webp",
      "/seed_mau/massage/logos/logo-3.webp"
    ],
    "gallery": [
      "/seed_mau/massage/gallery/gallery-1.webp",
      "/seed_mau/massage/gallery/gallery-2.webp",
      "/seed_mau/massage/gallery/gallery-3.webp",
      "/seed_mau/massage/gallery/gallery-4.webp"
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
      "Thư giãn",
      "Trị liệu",
      "Cổ vai gáy",
      "Body",
      "Foot"
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
      "massage",
      "thư giãn",
      "trị liệu"
    ],
    "customFields": {
      "item": [
        "Massage Thái",
        "Massage đá nóng",
        "Massage cổ vai",
        "Massage body",
        "Foot massage"
      ],
      "category": [
        "Thư giãn",
        "Trị liệu",
        "Cổ vai gáy",
        "Body",
        "Foot"
      ],
      "brand": [
        "WellCare",
        "VitaPlus",
        "ZenLife",
        "Healio",
        "AnLac"
      ],
      "industry": [
        "Massage"
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
            "image": "/seed_mau/massage/hero/hero-1.webp",
            "link": "/products"
          },
          {
            "image": "/seed_mau/massage/hero/hero-2.webp",
            "link": "/products"
          }
        ],
        "content": {
          "badge": "Nổi bật",
          "heading": "Massage chất lượng",
          "description": "Massage thư giãn, trị liệu chuyên nghiệp.",
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
        "heading": "Dịch vụ massage nổi bật",
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
        "heading": "Về Massage",
        "content": "Massage thư giãn, trị liệu chuyên nghiệp.",
        "image": "/seed_mau/massage/gallery/gallery-1.webp"
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
