import type { IndustryTemplate } from '../types';

export const industryTemplate: IndustryTemplate = {
  "key": "real-estate",
  "name": "Bất động sản",
  "icon": "🏘️",
  "description": "Dự án bất động sản, tư vấn mua bán.",
  "category": "business",
  "websiteTypes": [
    "services",
    "landing"
  ],
  "saleMode": "contact",
  "productType": "physical",
  "businessType": "RealEstateAgent",
  "brandColor": "#f97316",
  "tags": [
    "bất động sản",
    "dự án",
    "tư vấn"
  ],
  "assets": {
    "hero": [
      "/seed_mau/real-estate/hero/1.webp",
      "/seed_mau/real-estate/hero/10.webp",
      "/seed_mau/real-estate/hero/11.webp",
      "/seed_mau/real-estate/hero/12.webp",
      "/seed_mau/real-estate/hero/13.webp",
      "/seed_mau/real-estate/hero/14.webp",
      "/seed_mau/real-estate/hero/15.webp",
      "/seed_mau/real-estate/hero/16.webp",
      "/seed_mau/real-estate/hero/17.webp",
      "/seed_mau/real-estate/hero/18.webp",
      "/seed_mau/real-estate/hero/19.webp",
      "/seed_mau/real-estate/hero/2.webp",
      "/seed_mau/real-estate/hero/20.webp",
      "/seed_mau/real-estate/hero/21.webp",
      "/seed_mau/real-estate/hero/22.webp",
      "/seed_mau/real-estate/hero/23.webp",
      "/seed_mau/real-estate/hero/24.webp",
      "/seed_mau/real-estate/hero/25.webp",
      "/seed_mau/real-estate/hero/3.webp",
      "/seed_mau/real-estate/hero/4.webp",
      "/seed_mau/real-estate/hero/5.webp",
      "/seed_mau/real-estate/hero/6.webp",
      "/seed_mau/real-estate/hero/7.webp",
      "/seed_mau/real-estate/hero/8.webp",
      "/seed_mau/real-estate/hero/9.webp"
    ],
    "products": [
      "/seed_mau/real-estate/products/product-1.webp",
      "/seed_mau/real-estate/products/product-2.webp",
      "/seed_mau/real-estate/products/product-3.webp",
      "/seed_mau/real-estate/products/product-4.webp"
    ],
    "posts": [
      "/seed_mau/real-estate/posts/post-1.webp",
      "/seed_mau/real-estate/posts/post-2.webp",
      "/seed_mau/real-estate/posts/post-3.webp"
    ],
    "logos": [
      "/seed_mau/real-estate/logos/logo-1.webp",
      "/seed_mau/real-estate/logos/logo-2.webp",
      "/seed_mau/real-estate/logos/logo-3.webp"
    ],
    "gallery": [
      "/seed_mau/real-estate/gallery/gallery-1.webp",
      "/seed_mau/real-estate/gallery/gallery-2.webp",
      "/seed_mau/real-estate/gallery/gallery-3.webp",
      "/seed_mau/real-estate/gallery/gallery-4.webp"
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
      "Căn hộ",
      "Nhà phố",
      "Đất nền",
      "Dự án",
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
      "bất động sản",
      "dự án",
      "tư vấn"
    ],
    "customFields": {
      "item": [
        "Căn hộ",
        "Nhà phố",
        "Đất nền",
        "Bất động sản nghỉ dưỡng"
      ],
      "category": [
        "Căn hộ",
        "Nhà phố",
        "Đất nền",
        "Dự án",
        "Tư vấn"
      ],
      "brand": [
        "VietBuild",
        "CoreBiz",
        "Nexus",
        "Prime",
        "Atlas"
      ],
      "industry": [
        "Bất động sản"
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
            "image": "/seed_mau/real-estate/hero/1.webp",
            "link": "/products"
          },
          {
            "image": "/seed_mau/real-estate/hero/10.webp",
            "link": "/products"
          }
        ],
        "content": {
          "badge": "Nổi bật",
          "heading": "Bất động sản chất lượng",
          "description": "Dự án bất động sản, tư vấn mua bán.",
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
        "heading": "Dịch vụ bất động sản nổi bật",
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
        "heading": "Về Bất động sản",
        "content": "Dự án bất động sản, tư vấn mua bán.",
        "image": "/seed_mau/real-estate/gallery/gallery-1.webp"
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
