import type { IndustryTemplate } from '../types';

export const industryTemplate: IndustryTemplate = {
  "key": "healthcare",
  "name": "Chăm sóc sức khỏe",
  "icon": "🏥",
  "description": "Dịch vụ chăm sóc sức khỏe, đặt lịch nhanh.",
  "category": "health-wellness",
  "websiteTypes": [
    "services",
    "landing"
  ],
  "saleMode": "contact",
  "productType": "physical",
  "businessType": "MedicalBusiness",
  "brandColor": "#0d9488",
  "tags": [
    "y tế",
    "chăm sóc",
    "đặt lịch"
  ],
  "assets": {
    "hero": [
      "/seed_mau/healthcare/hero/hero-1.jpg",
      "/seed_mau/healthcare/hero/hero-2.jpg"
    ],
    "products": [
      "/seed_mau/healthcare/products/product-1.jpg",
      "/seed_mau/healthcare/products/product-2.jpg",
      "/seed_mau/healthcare/products/product-3.jpg",
      "/seed_mau/healthcare/products/product-4.jpg"
    ],
    "posts": [
      "/seed_mau/healthcare/posts/post-1.jpg",
      "/seed_mau/healthcare/posts/post-2.jpg",
      "/seed_mau/healthcare/posts/post-3.jpg"
    ],
    "logos": [
      "/seed_mau/healthcare/logos/logo-1.png",
      "/seed_mau/healthcare/logos/logo-2.png",
      "/seed_mau/healthcare/logos/logo-3.png"
    ],
    "gallery": [
      "/seed_mau/healthcare/gallery/gallery-1.jpg",
      "/seed_mau/healthcare/gallery/gallery-2.jpg",
      "/seed_mau/healthcare/gallery/gallery-3.jpg",
      "/seed_mau/healthcare/gallery/gallery-4.jpg"
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
      "Khám tổng quát",
      "Xét nghiệm",
      "Chuyên khoa",
      "Chăm sóc tại nhà",
      "Tư vấn"
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
      "y tế",
      "chăm sóc",
      "đặt lịch"
    ],
    "customFields": {
      "item": [
        "Khám tổng quát",
        "Tư vấn sức khỏe",
        "Gói xét nghiệm",
        "Chăm sóc tại nhà",
        "Tầm soát"
      ],
      "category": [
        "Khám tổng quát",
        "Xét nghiệm",
        "Chuyên khoa",
        "Chăm sóc tại nhà",
        "Tư vấn"
      ],
      "brand": [
        "WellCare",
        "VitaPlus",
        "ZenLife",
        "Healio",
        "AnLac"
      ],
      "industry": [
        "Chăm sóc sức khỏe"
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
            "image": "/seed_mau/healthcare/hero/hero-1.jpg",
            "link": "/products"
          },
          {
            "image": "/seed_mau/healthcare/hero/hero-2.jpg",
            "link": "/products"
          }
        ],
        "content": {
          "badge": "Nổi bật",
          "heading": "Chăm sóc sức khỏe chất lượng",
          "description": "Dịch vụ chăm sóc sức khỏe, đặt lịch nhanh.",
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
        "heading": "Dịch vụ chăm sóc sức khỏe nổi bật",
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
        "heading": "Về Chăm sóc sức khỏe",
        "content": "Dịch vụ chăm sóc sức khỏe, đặt lịch nhanh.",
        "image": "/seed_mau/healthcare/gallery/gallery-1.jpg"
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
