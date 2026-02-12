import type { IndustryTemplate } from '../types';

export const industryTemplate: IndustryTemplate = {
  "key": "construction",
  "name": "Xây dựng",
  "icon": "🏗️",
  "description": "Thiết kế và thi công công trình.",
  "category": "business",
  "websiteTypes": [
    "services",
    "landing"
  ],
  "saleMode": "contact",
  "productType": "physical",
  "businessType": "ConstructionBusiness",
  "brandColor": "#16a34a",
  "tags": [
    "xây dựng",
    "thi công",
    "thiết kế"
  ],
  "assets": {
    "hero": [
      "/seed_mau/construction/hero/1.webp",
      "/seed_mau/construction/hero/10.webp",
      "/seed_mau/construction/hero/11.webp",
      "/seed_mau/construction/hero/12.webp",
      "/seed_mau/construction/hero/13.webp",
      "/seed_mau/construction/hero/14.webp",
      "/seed_mau/construction/hero/15.webp",
      "/seed_mau/construction/hero/16.webp",
      "/seed_mau/construction/hero/17.webp",
      "/seed_mau/construction/hero/18.webp",
      "/seed_mau/construction/hero/19.webp",
      "/seed_mau/construction/hero/2.webp",
      "/seed_mau/construction/hero/20.webp",
      "/seed_mau/construction/hero/21.webp",
      "/seed_mau/construction/hero/22.webp",
      "/seed_mau/construction/hero/23.webp",
      "/seed_mau/construction/hero/3.webp",
      "/seed_mau/construction/hero/4.webp",
      "/seed_mau/construction/hero/5.webp",
      "/seed_mau/construction/hero/6.webp",
      "/seed_mau/construction/hero/7.webp",
      "/seed_mau/construction/hero/8.webp",
      "/seed_mau/construction/hero/9.webp"
    ],
    "products": [
      "/seed_mau/construction/products/product-1.webp",
      "/seed_mau/construction/products/product-2.webp",
      "/seed_mau/construction/products/product-3.webp",
      "/seed_mau/construction/products/product-4.webp"
    ],
    "posts": [
      "/seed_mau/construction/posts/post-1.webp",
      "/seed_mau/construction/posts/post-2.webp",
      "/seed_mau/construction/posts/post-3.webp"
    ],
    "logos": [
      "/seed_mau/construction/logos/logo-1.webp",
      "/seed_mau/construction/logos/logo-2.webp",
      "/seed_mau/construction/logos/logo-3.webp"
    ],
    "gallery": [
      "/seed_mau/construction/gallery/gallery-1.webp",
      "/seed_mau/construction/gallery/gallery-2.webp",
      "/seed_mau/construction/gallery/gallery-3.webp",
      "/seed_mau/construction/gallery/gallery-4.webp"
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
      "Nhà ở",
      "Văn phòng",
      "Công nghiệp",
      "Nội thất",
      "Bảo trì"
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
      "xây dựng",
      "thi công",
      "thiết kế"
    ],
    "customFields": {
      "item": [
        "Thiết kế",
        "Thi công",
        "Giám sát",
        "Bảo trì",
        "Nội thất"
      ],
      "category": [
        "Nhà ở",
        "Văn phòng",
        "Công nghiệp",
        "Nội thất",
        "Bảo trì"
      ],
      "brand": [
        "VietBuild",
        "CoreBiz",
        "Nexus",
        "Prime",
        "Atlas"
      ],
      "industry": [
        "Xây dựng"
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
            "image": "/seed_mau/construction/hero/1.webp",
            "link": "/products"
          },
          {
            "image": "/seed_mau/construction/hero/10.webp",
            "link": "/products"
          }
        ],
        "content": {
          "badge": "Nổi bật",
          "heading": "Xây dựng chất lượng",
          "description": "Thiết kế và thi công công trình.",
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
        "heading": "Dịch vụ xây dựng nổi bật",
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
        "heading": "Về Xây dựng",
        "content": "Thiết kế và thi công công trình.",
        "image": "/seed_mau/construction/gallery/gallery-1.webp"
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
