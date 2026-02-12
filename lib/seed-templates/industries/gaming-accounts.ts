import type { IndustryTemplate } from '../types';

export const industryTemplate: IndustryTemplate = {
  "key": "gaming-accounts",
  "name": "Tài khoản game",
  "icon": "🎮",
  "description": "Tài khoản game, vật phẩm số, gói nạp nhanh.",
  "category": "technology",
  "websiteTypes": [
    "catalog",
    "ecommerce"
  ],
  "saleMode": "affiliate",
  "productType": "digital",
  "businessType": "Store",
  "brandColor": "#d97706",
  "tags": [
    "game",
    "tài khoản",
    "nạp nhanh"
  ],
  "assets": {
    "hero": [
      "/seed_mau/gaming-accounts/hero/hero-1.jpg",
      "/seed_mau/gaming-accounts/hero/hero-2.jpg"
    ],
    "products": [
      "/seed_mau/gaming-accounts/products/product-1.jpg",
      "/seed_mau/gaming-accounts/products/product-2.jpg",
      "/seed_mau/gaming-accounts/products/product-3.jpg",
      "/seed_mau/gaming-accounts/products/product-4.jpg"
    ],
    "posts": [
      "/seed_mau/gaming-accounts/posts/post-1.jpg",
      "/seed_mau/gaming-accounts/posts/post-2.jpg",
      "/seed_mau/gaming-accounts/posts/post-3.jpg"
    ],
    "logos": [
      "/seed_mau/gaming-accounts/logos/logo-1.png",
      "/seed_mau/gaming-accounts/logos/logo-2.png",
      "/seed_mau/gaming-accounts/logos/logo-3.png"
    ],
    "gallery": [
      "/seed_mau/gaming-accounts/gallery/gallery-1.jpg",
      "/seed_mau/gaming-accounts/gallery/gallery-2.jpg",
      "/seed_mau/gaming-accounts/gallery/gallery-3.jpg",
      "/seed_mau/gaming-accounts/gallery/gallery-4.jpg"
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
      "FPS",
      "MOBA",
      "RPG",
      "Mobile",
      "Giftcode"
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
      "game",
      "tài khoản",
      "nạp nhanh"
    ],
    "customFields": {
      "item": [
        "Acc Liên Minh",
        "Acc Valorant",
        "Acc Genshin",
        "Giftcode",
        "Gói nạp"
      ],
      "category": [
        "FPS",
        "MOBA",
        "RPG",
        "Mobile",
        "Giftcode"
      ],
      "brand": [
        "Apex",
        "ZenTech",
        "Nova",
        "Lumix",
        "Omni"
      ],
      "industry": [
        "Tài khoản game"
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
            "image": "/seed_mau/gaming-accounts/hero/hero-1.jpg",
            "link": "/products"
          },
          {
            "image": "/seed_mau/gaming-accounts/hero/hero-2.jpg",
            "link": "/products"
          }
        ],
        "content": {
          "badge": "Nổi bật",
          "heading": "Tài khoản game chất lượng",
          "description": "Tài khoản game, vật phẩm số, gói nạp nhanh.",
          "primaryButtonText": "Khám phá ngay",
          "secondaryButtonText": "Tìm hiểu thêm"
        }
      }
    },
    {
      "type": "ProductCategories",
      "title": "Danh mục sản phẩm",
      "order": 1,
      "active": true,
      "config": {
        "categories": [],
        "columnsDesktop": 4,
        "columnsMobile": 2,
        "showProductCount": true,
        "style": "grid"
      }
    },
    {
      "type": "ProductList",
      "title": "Sản phẩm nổi bật",
      "order": 2,
      "active": true,
      "config": {
        "heading": "Sản phẩm tài khoản game nổi bật",
        "subheading": "Gợi ý sản phẩm bán chạy",
        "limit": 8,
        "showButton": true,
        "showPrice": true
      }
    },
    {
      "type": "About",
      "title": "Giới thiệu",
      "order": 3,
      "active": true,
      "config": {
        "heading": "Về Tài khoản game",
        "content": "Tài khoản game, vật phẩm số, gói nạp nhanh.",
        "image": "/seed_mau/gaming-accounts/gallery/gallery-1.jpg"
      }
    },
    {
      "type": "CTA",
      "title": "CTA",
      "order": 4,
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
      "order": 5,
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
      "order": 6,
      "active": true,
      "config": {
        "style": "classic"
      }
    }
  ],
  "experiencePresetKey": "modern"
};

export default industryTemplate;
