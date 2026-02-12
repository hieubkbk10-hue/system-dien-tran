import type { IndustryTemplate } from '../types';

export const industryTemplate: IndustryTemplate = {
  "key": "courses",
  "name": "Khóa học",
  "icon": "🎓",
  "description": "Khóa học online/offline, lộ trình rõ ràng.",
  "category": "services",
  "websiteTypes": [
    "services",
    "landing"
  ],
  "saleMode": "contact",
  "productType": "digital",
  "businessType": "EducationalOrganization",
  "brandColor": "#0d9488",
  "tags": [
    "khóa học",
    "đào tạo",
    "lộ trình"
  ],
  "assets": {
    "hero": [
      "/seed_mau/courses/hero/1.webp",
      "/seed_mau/courses/hero/10.webp",
      "/seed_mau/courses/hero/11.webp",
      "/seed_mau/courses/hero/12.webp",
      "/seed_mau/courses/hero/13.webp",
      "/seed_mau/courses/hero/14.webp",
      "/seed_mau/courses/hero/15.webp",
      "/seed_mau/courses/hero/16.webp",
      "/seed_mau/courses/hero/17.webp",
      "/seed_mau/courses/hero/18.webp",
      "/seed_mau/courses/hero/19.webp",
      "/seed_mau/courses/hero/2.webp",
      "/seed_mau/courses/hero/20.webp",
      "/seed_mau/courses/hero/3.webp",
      "/seed_mau/courses/hero/4.webp",
      "/seed_mau/courses/hero/5.webp",
      "/seed_mau/courses/hero/6.webp",
      "/seed_mau/courses/hero/7.webp",
      "/seed_mau/courses/hero/8.webp",
      "/seed_mau/courses/hero/9.webp"
    ],
    "products": [
      "/seed_mau/courses/products/product-1.webp",
      "/seed_mau/courses/products/product-2.webp",
      "/seed_mau/courses/products/product-3.webp",
      "/seed_mau/courses/products/product-4.webp"
    ],
    "posts": [
      "/seed_mau/courses/posts/post-1.webp",
      "/seed_mau/courses/posts/post-2.webp",
      "/seed_mau/courses/posts/post-3.webp"
    ],
    "logos": [
      "/seed_mau/courses/logos/logo-1.webp",
      "/seed_mau/courses/logos/logo-2.webp",
      "/seed_mau/courses/logos/logo-3.webp"
    ],
    "gallery": [
      "/seed_mau/courses/gallery/gallery-1.webp",
      "/seed_mau/courses/gallery/gallery-2.webp",
      "/seed_mau/courses/gallery/gallery-3.webp",
      "/seed_mau/courses/gallery/gallery-4.webp"
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
      "Online",
      "Offline",
      "Workshop",
      "Combo",
      "Doanh nghiệp"
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
      "khóa học",
      "đào tạo",
      "lộ trình"
    ],
    "customFields": {
      "item": [
        "Khoá marketing",
        "Khoá thiết kế",
        "Khoá lập trình",
        "Khoá tiếng Anh",
        "Workshop"
      ],
      "category": [
        "Online",
        "Offline",
        "Workshop",
        "Combo",
        "Doanh nghiệp"
      ],
      "brand": [
        "ProServe",
        "BizPro",
        "VietPro",
        "NovaCare",
        "Optima"
      ],
      "industry": [
        "Khóa học"
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
            "image": "/seed_mau/courses/hero/1.webp",
            "link": "/products"
          },
          {
            "image": "/seed_mau/courses/hero/10.webp",
            "link": "/products"
          }
        ],
        "content": {
          "badge": "Nổi bật",
          "heading": "Khóa học chất lượng",
          "description": "Khóa học online/offline, lộ trình rõ ràng.",
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
        "heading": "Dịch vụ khóa học nổi bật",
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
        "heading": "Về Khóa học",
        "content": "Khóa học online/offline, lộ trình rõ ràng.",
        "image": "/seed_mau/courses/gallery/gallery-1.webp"
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
