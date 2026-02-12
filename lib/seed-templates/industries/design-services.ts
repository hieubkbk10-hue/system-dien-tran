import type { IndustryTemplate } from '../types';

export const industryTemplate: IndustryTemplate = {
  "key": "design-services",
  "name": "Thiết kế sáng tạo",
  "icon": "🎨",
  "description": "Dịch vụ thiết kế thương hiệu, UI/UX.",
  "category": "services",
  "websiteTypes": [
    "services",
    "landing"
  ],
  "saleMode": "contact",
  "productType": "physical",
  "businessType": "ProfessionalService",
  "brandColor": "#7c3aed",
  "tags": [
    "thiết kế",
    "sáng tạo",
    "branding"
  ],
  "assets": {
    "hero": [
      "/seed_mau/design-services/hero/hero-1.webp",
      "/seed_mau/design-services/hero/hero-2.webp"
    ],
    "products": [
      "/seed_mau/design-services/products/product-1.webp",
      "/seed_mau/design-services/products/product-2.webp",
      "/seed_mau/design-services/products/product-3.webp",
      "/seed_mau/design-services/products/product-4.webp"
    ],
    "posts": [
      "/seed_mau/design-services/posts/post-1.webp",
      "/seed_mau/design-services/posts/post-2.webp",
      "/seed_mau/design-services/posts/post-3.webp"
    ],
    "logos": [
      "/seed_mau/design-services/logos/logo-1.webp",
      "/seed_mau/design-services/logos/logo-2.webp",
      "/seed_mau/design-services/logos/logo-3.webp"
    ],
    "gallery": [
      "/seed_mau/design-services/gallery/gallery-1.webp",
      "/seed_mau/design-services/gallery/gallery-2.webp",
      "/seed_mau/design-services/gallery/gallery-3.webp",
      "/seed_mau/design-services/gallery/gallery-4.webp"
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
      "Branding",
      "UI/UX",
      "Digital",
      "Print",
      "Gói combo"
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
      "thiết kế",
      "sáng tạo",
      "branding"
    ],
    "customFields": {
      "item": [
        "Thiết kế logo",
        "Branding",
        "UI/UX",
        "Ấn phẩm",
        "Website"
      ],
      "category": [
        "Branding",
        "UI/UX",
        "Digital",
        "Print",
        "Gói combo"
      ],
      "brand": [
        "ProServe",
        "BizPro",
        "VietPro",
        "NovaCare",
        "Optima"
      ],
      "industry": [
        "Thiết kế sáng tạo"
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
            "image": "/seed_mau/design-services/hero/hero-1.webp",
            "link": "/products"
          },
          {
            "image": "/seed_mau/design-services/hero/hero-2.webp",
            "link": "/products"
          }
        ],
        "content": {
          "badge": "Nổi bật",
          "heading": "Thiết kế sáng tạo chất lượng",
          "description": "Dịch vụ thiết kế thương hiệu, UI/UX.",
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
        "heading": "Dịch vụ thiết kế sáng tạo nổi bật",
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
        "heading": "Về Thiết kế sáng tạo",
        "content": "Dịch vụ thiết kế thương hiệu, UI/UX.",
        "image": "/seed_mau/design-services/gallery/gallery-1.webp"
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
