import type { IndustryTemplate } from '../types';

export const industryTemplate: IndustryTemplate = {
  "key": "gym",
  "name": "Phòng gym",
  "icon": "🏋️‍♂️",
  "description": "Phòng gym hiện đại, gói tập linh hoạt.",
  "category": "health-wellness",
  "websiteTypes": [
    "services",
    "landing"
  ],
  "saleMode": "contact",
  "productType": "physical",
  "businessType": "HealthClub",
  "brandColor": "#16a34a",
  "tags": [
    "gym",
    "thể hình",
    "tập luyện"
  ],
  "assets": {
    "hero": [
      "/seed_mau/gym/hero/hero-1.webp",
      "/seed_mau/gym/hero/hero-2.webp"
    ],
    "products": [
      "/seed_mau/gym/products/product-1.webp",
      "/seed_mau/gym/products/product-2.webp",
      "/seed_mau/gym/products/product-3.webp",
      "/seed_mau/gym/products/product-4.webp"
    ],
    "posts": [
      "/seed_mau/gym/posts/post-1.webp",
      "/seed_mau/gym/posts/post-2.webp",
      "/seed_mau/gym/posts/post-3.webp"
    ],
    "logos": [
      "/seed_mau/gym/logos/logo-1.webp",
      "/seed_mau/gym/logos/logo-2.webp",
      "/seed_mau/gym/logos/logo-3.webp"
    ],
    "gallery": [
      "/seed_mau/gym/gallery/gallery-1.webp",
      "/seed_mau/gym/gallery/gallery-2.webp",
      "/seed_mau/gym/gallery/gallery-3.webp",
      "/seed_mau/gym/gallery/gallery-4.webp"
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
      "Gói tập",
      "PT",
      "Lớp nhóm",
      "Gói gia đình",
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
      "gym",
      "thể hình",
      "tập luyện"
    ],
    "customFields": {
      "item": [
        "Gói tập tháng",
        "Gói tập năm",
        "PT 1-1",
        "Lớp HIIT",
        "Gói gia đình"
      ],
      "category": [
        "Gói tập",
        "PT",
        "Lớp nhóm",
        "Gói gia đình",
        "Khuyến mãi"
      ],
      "brand": [
        "WellCare",
        "VitaPlus",
        "ZenLife",
        "Healio",
        "AnLac"
      ],
      "industry": [
        "Phòng gym"
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
            "image": "/seed_mau/gym/hero/hero-1.webp",
            "link": "/products"
          },
          {
            "image": "/seed_mau/gym/hero/hero-2.webp",
            "link": "/products"
          }
        ],
        "content": {
          "badge": "Nổi bật",
          "heading": "Phòng gym chất lượng",
          "description": "Phòng gym hiện đại, gói tập linh hoạt.",
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
        "heading": "Dịch vụ phòng gym nổi bật",
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
        "heading": "Về Phòng gym",
        "content": "Phòng gym hiện đại, gói tập linh hoạt.",
        "image": "/seed_mau/gym/gallery/gallery-1.webp"
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
