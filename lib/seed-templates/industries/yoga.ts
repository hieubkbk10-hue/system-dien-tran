import type { IndustryTemplate } from '../types';

export const industryTemplate: IndustryTemplate = {
  "key": "yoga",
  "name": "Yoga",
  "icon": "🧘",
  "description": "Lớp yoga, thiền, chăm sóc tinh thần.",
  "category": "health-wellness",
  "websiteTypes": [
    "services",
    "landing"
  ],
  "saleMode": "contact",
  "productType": "physical",
  "businessType": "SportsActivityLocation",
  "brandColor": "#f97316",
  "tags": [
    "yoga",
    "thiền",
    "wellness"
  ],
  "assets": {
    "hero": [
      "/seed_mau/yoga/hero/hero-1.jpg",
      "/seed_mau/yoga/hero/hero-2.jpg"
    ],
    "products": [
      "/seed_mau/yoga/products/product-1.jpg",
      "/seed_mau/yoga/products/product-2.jpg",
      "/seed_mau/yoga/products/product-3.jpg",
      "/seed_mau/yoga/products/product-4.jpg"
    ],
    "posts": [
      "/seed_mau/yoga/posts/post-1.jpg",
      "/seed_mau/yoga/posts/post-2.jpg",
      "/seed_mau/yoga/posts/post-3.jpg"
    ],
    "logos": [
      "/seed_mau/yoga/logos/logo-1.png",
      "/seed_mau/yoga/logos/logo-2.png",
      "/seed_mau/yoga/logos/logo-3.png"
    ],
    "gallery": [
      "/seed_mau/yoga/gallery/gallery-1.jpg",
      "/seed_mau/yoga/gallery/gallery-2.jpg",
      "/seed_mau/yoga/gallery/gallery-3.jpg",
      "/seed_mau/yoga/gallery/gallery-4.jpg"
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
      "Yoga",
      "Thiền",
      "Workshop",
      "Gói tháng",
      "Gói năm"
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
      "yoga",
      "thiền",
      "wellness"
    ],
    "customFields": {
      "item": [
        "Yoga cơ bản",
        "Yoga nâng cao",
        "Thiền",
        "Yoga bầu",
        "Workshop"
      ],
      "category": [
        "Yoga",
        "Thiền",
        "Workshop",
        "Gói tháng",
        "Gói năm"
      ],
      "brand": [
        "WellCare",
        "VitaPlus",
        "ZenLife",
        "Healio",
        "AnLac"
      ],
      "industry": [
        "Yoga"
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
            "image": "/seed_mau/yoga/hero/hero-1.jpg",
            "link": "/products"
          },
          {
            "image": "/seed_mau/yoga/hero/hero-2.jpg",
            "link": "/products"
          }
        ],
        "content": {
          "badge": "Nổi bật",
          "heading": "Yoga chất lượng",
          "description": "Lớp yoga, thiền, chăm sóc tinh thần.",
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
        "heading": "Dịch vụ yoga nổi bật",
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
        "heading": "Về Yoga",
        "content": "Lớp yoga, thiền, chăm sóc tinh thần.",
        "image": "/seed_mau/yoga/gallery/gallery-1.jpg"
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
