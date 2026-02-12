import type { IndustryTemplate } from '../types';

export const industryTemplate: IndustryTemplate = {
  "key": "fitness",
  "name": "Fitness",
  "icon": "🏋️",
  "description": "Luyện tập fitness, PT cá nhân.",
  "category": "health-wellness",
  "websiteTypes": [
    "services",
    "landing"
  ],
  "saleMode": "contact",
  "productType": "physical",
  "businessType": "HealthClub",
  "brandColor": "#dc2626",
  "tags": [
    "fitness",
    "luyện tập",
    "PT"
  ],
  "assets": {
    "hero": [
      "/seed_mau/fitness/hero/1.webp",
      "/seed_mau/fitness/hero/10.webp",
      "/seed_mau/fitness/hero/11.webp",
      "/seed_mau/fitness/hero/12.webp",
      "/seed_mau/fitness/hero/13.webp",
      "/seed_mau/fitness/hero/14.webp",
      "/seed_mau/fitness/hero/15.webp",
      "/seed_mau/fitness/hero/16.webp",
      "/seed_mau/fitness/hero/17.webp",
      "/seed_mau/fitness/hero/18.webp",
      "/seed_mau/fitness/hero/19.webp",
      "/seed_mau/fitness/hero/2.webp",
      "/seed_mau/fitness/hero/20.webp",
      "/seed_mau/fitness/hero/21.webp",
      "/seed_mau/fitness/hero/22.webp",
      "/seed_mau/fitness/hero/3.webp",
      "/seed_mau/fitness/hero/4.webp",
      "/seed_mau/fitness/hero/5.webp",
      "/seed_mau/fitness/hero/6.webp",
      "/seed_mau/fitness/hero/7.webp",
      "/seed_mau/fitness/hero/8.webp",
      "/seed_mau/fitness/hero/9.webp"
    ],
    "products": [
      "/seed_mau/fitness/products/product-1.webp",
      "/seed_mau/fitness/products/product-2.webp",
      "/seed_mau/fitness/products/product-3.webp",
      "/seed_mau/fitness/products/product-4.webp"
    ],
    "posts": [
      "/seed_mau/fitness/posts/post-1.webp",
      "/seed_mau/fitness/posts/post-2.webp",
      "/seed_mau/fitness/posts/post-3.webp"
    ],
    "logos": [
      "/seed_mau/fitness/logos/logo-1.webp",
      "/seed_mau/fitness/logos/logo-2.webp",
      "/seed_mau/fitness/logos/logo-3.webp"
    ],
    "gallery": [
      "/seed_mau/fitness/gallery/gallery-1.webp",
      "/seed_mau/fitness/gallery/gallery-2.webp",
      "/seed_mau/fitness/gallery/gallery-3.webp",
      "/seed_mau/fitness/gallery/gallery-4.webp"
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
      "PT",
      "Lớp nhóm",
      "Gói tháng",
      "Gói năm",
      "Dinh dưỡng"
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
      "fitness",
      "luyện tập",
      "PT"
    ],
    "customFields": {
      "item": [
        "Gói PT",
        "Gói tháng",
        "Gói năm",
        "Lớp nhóm",
        "Dinh dưỡng"
      ],
      "category": [
        "PT",
        "Lớp nhóm",
        "Gói tháng",
        "Gói năm",
        "Dinh dưỡng"
      ],
      "brand": [
        "WellCare",
        "VitaPlus",
        "ZenLife",
        "Healio",
        "AnLac"
      ],
      "industry": [
        "Fitness"
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
            "image": "/seed_mau/fitness/hero/1.webp",
            "link": "/products"
          },
          {
            "image": "/seed_mau/fitness/hero/10.webp",
            "link": "/products"
          }
        ],
        "content": {
          "badge": "Nổi bật",
          "heading": "Fitness chất lượng",
          "description": "Luyện tập fitness, PT cá nhân.",
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
        "heading": "Dịch vụ fitness nổi bật",
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
        "heading": "Về Fitness",
        "content": "Luyện tập fitness, PT cá nhân.",
        "image": "/seed_mau/fitness/gallery/gallery-1.webp"
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
