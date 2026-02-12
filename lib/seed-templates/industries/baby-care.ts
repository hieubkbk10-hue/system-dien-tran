import type { IndustryTemplate } from '../types';

export const industryTemplate: IndustryTemplate = {
  "key": "baby-care",
  "name": "Mẹ & Bé",
  "icon": "🍼",
  "description": "Sản phẩm chăm sóc mẹ và bé an toàn.",
  "category": "retail",
  "websiteTypes": [
    "catalog",
    "ecommerce"
  ],
  "saleMode": "cart",
  "productType": "physical",
  "businessType": "Store",
  "brandColor": "#4f46e5",
  "tags": [
    "mẹ và bé",
    "an toàn",
    "chính hãng"
  ],
  "assets": {
    "hero": [
      "/seed_mau/baby-care/hero/hero-1.webp",
      "/seed_mau/baby-care/hero/hero-2.webp"
    ],
    "products": [
      "/seed_mau/baby-care/products/product-1.webp",
      "/seed_mau/baby-care/products/product-2.webp",
      "/seed_mau/baby-care/products/product-3.webp",
      "/seed_mau/baby-care/products/product-4.webp"
    ],
    "posts": [
      "/seed_mau/baby-care/posts/post-1.webp",
      "/seed_mau/baby-care/posts/post-2.webp",
      "/seed_mau/baby-care/posts/post-3.webp"
    ],
    "logos": [
      "/seed_mau/baby-care/logos/logo-1.webp",
      "/seed_mau/baby-care/logos/logo-2.webp",
      "/seed_mau/baby-care/logos/logo-3.webp"
    ],
    "gallery": [
      "/seed_mau/baby-care/gallery/gallery-1.webp",
      "/seed_mau/baby-care/gallery/gallery-2.webp",
      "/seed_mau/baby-care/gallery/gallery-3.webp",
      "/seed_mau/baby-care/gallery/gallery-4.webp"
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
      "Sơ sinh",
      "Dinh dưỡng",
      "Đồ chơi",
      "Thời trang",
      "Dụng cụ"
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
      "mẹ và bé",
      "an toàn",
      "chính hãng"
    ],
    "customFields": {
      "item": [
        "Tã",
        "Sữa",
        "Xe đẩy",
        "Đồ chơi",
        "Áo quần"
      ],
      "category": [
        "Sơ sinh",
        "Dinh dưỡng",
        "Đồ chơi",
        "Thời trang",
        "Dụng cụ"
      ],
      "brand": [
        "VietMart",
        "ZenHome",
        "Nova",
        "Lumia",
        "Sendo"
      ],
      "industry": [
        "Mẹ & Bé"
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
            "image": "/seed_mau/baby-care/hero/hero-1.webp",
            "link": "/products"
          },
          {
            "image": "/seed_mau/baby-care/hero/hero-2.webp",
            "link": "/products"
          }
        ],
        "content": {
          "badge": "Nổi bật",
          "heading": "Mẹ & Bé chất lượng",
          "description": "Sản phẩm chăm sóc mẹ và bé an toàn.",
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
        "heading": "Sản phẩm mẹ & bé nổi bật",
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
        "heading": "Về Mẹ & Bé",
        "content": "Sản phẩm chăm sóc mẹ và bé an toàn.",
        "image": "/seed_mau/baby-care/gallery/gallery-1.webp"
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
