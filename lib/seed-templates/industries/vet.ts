import type { IndustryTemplate } from '../types';

export const industryTemplate: IndustryTemplate = {
  "key": "vet",
  "name": "Thú y",
  "icon": "🐾",
  "description": "Chăm sóc thú cưng, đặt lịch khám.",
  "category": "health-wellness",
  "websiteTypes": [
    "services",
    "landing"
  ],
  "saleMode": "contact",
  "productType": "physical",
  "businessType": "VeterinaryCare",
  "brandColor": "#7c3aed",
  "tags": [
    "thú y",
    "thú cưng",
    "chăm sóc"
  ],
  "assets": {
    "hero": [
      "/seed_mau/vet/hero/hero-1.jpg",
      "/seed_mau/vet/hero/hero-2.jpg"
    ],
    "products": [
      "/seed_mau/vet/products/product-1.jpg",
      "/seed_mau/vet/products/product-2.jpg",
      "/seed_mau/vet/products/product-3.jpg",
      "/seed_mau/vet/products/product-4.jpg"
    ],
    "posts": [
      "/seed_mau/vet/posts/post-1.jpg",
      "/seed_mau/vet/posts/post-2.jpg",
      "/seed_mau/vet/posts/post-3.jpg"
    ],
    "logos": [
      "/seed_mau/vet/logos/logo-1.png",
      "/seed_mau/vet/logos/logo-2.png",
      "/seed_mau/vet/logos/logo-3.png"
    ],
    "gallery": [
      "/seed_mau/vet/gallery/gallery-1.jpg",
      "/seed_mau/vet/gallery/gallery-2.jpg",
      "/seed_mau/vet/gallery/gallery-3.jpg",
      "/seed_mau/vet/gallery/gallery-4.jpg"
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
      "Khám bệnh",
      "Tiêm phòng",
      "Spa",
      "Dinh dưỡng",
      "Phụ kiện"
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
      "thú y",
      "thú cưng",
      "chăm sóc"
    ],
    "customFields": {
      "item": [
        "Khám tổng quát",
        "Tiêm phòng",
        "Spa thú cưng",
        "Dinh dưỡng",
        "Phẫu thuật"
      ],
      "category": [
        "Khám bệnh",
        "Tiêm phòng",
        "Spa",
        "Dinh dưỡng",
        "Phụ kiện"
      ],
      "brand": [
        "WellCare",
        "VitaPlus",
        "ZenLife",
        "Healio",
        "AnLac"
      ],
      "industry": [
        "Thú y"
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
            "image": "/seed_mau/vet/hero/hero-1.jpg",
            "link": "/products"
          },
          {
            "image": "/seed_mau/vet/hero/hero-2.jpg",
            "link": "/products"
          }
        ],
        "content": {
          "badge": "Nổi bật",
          "heading": "Thú y chất lượng",
          "description": "Chăm sóc thú cưng, đặt lịch khám.",
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
        "heading": "Dịch vụ thú y nổi bật",
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
        "heading": "Về Thú y",
        "content": "Chăm sóc thú cưng, đặt lịch khám.",
        "image": "/seed_mau/vet/gallery/gallery-1.jpg"
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
