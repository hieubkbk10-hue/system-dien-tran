import type { IndustryTemplate } from '../types';

export const industryTemplate: IndustryTemplate = {
  "key": "manufacturing",
  "name": "Sản xuất",
  "icon": "🏭",
  "description": "Giải pháp sản xuất, tối ưu dây chuyền.",
  "category": "business",
  "websiteTypes": [
    "services",
    "landing"
  ],
  "saleMode": "contact",
  "productType": "physical",
  "businessType": "LocalBusiness",
  "brandColor": "#dc2626",
  "tags": [
    "sản xuất",
    "nhà xưởng",
    "tối ưu"
  ],
  "assets": {
    "hero": [
      "/seed_mau/manufacturing/hero/hero-1.webp",
      "/seed_mau/manufacturing/hero/hero-2.webp"
    ],
    "products": [
      "/seed_mau/manufacturing/products/product-1.webp",
      "/seed_mau/manufacturing/products/product-2.webp",
      "/seed_mau/manufacturing/products/product-3.webp",
      "/seed_mau/manufacturing/products/product-4.webp"
    ],
    "posts": [
      "/seed_mau/manufacturing/posts/post-1.webp",
      "/seed_mau/manufacturing/posts/post-2.webp",
      "/seed_mau/manufacturing/posts/post-3.webp"
    ],
    "logos": [
      "/seed_mau/manufacturing/logos/logo-1.webp",
      "/seed_mau/manufacturing/logos/logo-2.webp",
      "/seed_mau/manufacturing/logos/logo-3.webp"
    ],
    "gallery": [
      "/seed_mau/manufacturing/gallery/gallery-1.webp",
      "/seed_mau/manufacturing/gallery/gallery-2.webp",
      "/seed_mau/manufacturing/gallery/gallery-3.webp",
      "/seed_mau/manufacturing/gallery/gallery-4.webp"
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
      "Thiết kế",
      "Tối ưu",
      "Bảo trì",
      "Vận hành",
      "An toàn"
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
      "sản xuất",
      "nhà xưởng",
      "tối ưu"
    ],
    "customFields": {
      "item": [
        "Tư vấn dây chuyền",
        "Thiết kế nhà xưởng",
        "Bảo trì",
        "Tối ưu"
      ],
      "category": [
        "Thiết kế",
        "Tối ưu",
        "Bảo trì",
        "Vận hành",
        "An toàn"
      ],
      "brand": [
        "VietBuild",
        "CoreBiz",
        "Nexus",
        "Prime",
        "Atlas"
      ],
      "industry": [
        "Sản xuất"
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
            "image": "/seed_mau/manufacturing/hero/hero-1.webp",
            "link": "/products"
          },
          {
            "image": "/seed_mau/manufacturing/hero/hero-2.webp",
            "link": "/products"
          }
        ],
        "content": {
          "badge": "Nổi bật",
          "heading": "Sản xuất chất lượng",
          "description": "Giải pháp sản xuất, tối ưu dây chuyền.",
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
        "heading": "Dịch vụ sản xuất nổi bật",
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
        "heading": "Về Sản xuất",
        "content": "Giải pháp sản xuất, tối ưu dây chuyền.",
        "image": "/seed_mau/manufacturing/gallery/gallery-1.webp"
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
