import type { IndustryTemplate } from '../types';

export const industryTemplate: IndustryTemplate = {
  "key": "handicraft",
  "name": "Đồ thủ công",
  "icon": "🧵",
  "description": "Sản phẩm thủ công, thiết kế độc bản.",
  "category": "retail",
  "websiteTypes": [
    "catalog",
    "ecommerce"
  ],
  "saleMode": "cart",
  "productType": "physical",
  "businessType": "Store",
  "brandColor": "#16a34a",
  "tags": [
    "thủ công",
    "độc bản",
    "tinh xảo"
  ],
  "assets": {
    "hero": [
      "/seed_mau/handicraft/hero/1.webp",
      "/seed_mau/handicraft/hero/10.webp",
      "/seed_mau/handicraft/hero/11.webp",
      "/seed_mau/handicraft/hero/12.webp",
      "/seed_mau/handicraft/hero/13.webp",
      "/seed_mau/handicraft/hero/14.webp",
      "/seed_mau/handicraft/hero/15.webp",
      "/seed_mau/handicraft/hero/16.webp",
      "/seed_mau/handicraft/hero/17.webp",
      "/seed_mau/handicraft/hero/18.webp",
      "/seed_mau/handicraft/hero/19.webp",
      "/seed_mau/handicraft/hero/2.webp",
      "/seed_mau/handicraft/hero/20.webp",
      "/seed_mau/handicraft/hero/21.webp",
      "/seed_mau/handicraft/hero/22.webp",
      "/seed_mau/handicraft/hero/23.webp",
      "/seed_mau/handicraft/hero/24.webp",
      "/seed_mau/handicraft/hero/25.webp",
      "/seed_mau/handicraft/hero/26.webp",
      "/seed_mau/handicraft/hero/27.webp",
      "/seed_mau/handicraft/hero/28.webp",
      "/seed_mau/handicraft/hero/29.webp",
      "/seed_mau/handicraft/hero/3.webp",
      "/seed_mau/handicraft/hero/30.webp",
      "/seed_mau/handicraft/hero/31.webp",
      "/seed_mau/handicraft/hero/32.webp",
      "/seed_mau/handicraft/hero/33.webp",
      "/seed_mau/handicraft/hero/4.webp",
      "/seed_mau/handicraft/hero/5.webp",
      "/seed_mau/handicraft/hero/6.webp",
      "/seed_mau/handicraft/hero/7.webp",
      "/seed_mau/handicraft/hero/8.webp",
      "/seed_mau/handicraft/hero/9.webp"
    ],
    "products": [
      "/seed_mau/handicraft/products/product-1.webp",
      "/seed_mau/handicraft/products/product-2.webp",
      "/seed_mau/handicraft/products/product-3.webp",
      "/seed_mau/handicraft/products/product-4.webp"
    ],
    "posts": [
      "/seed_mau/handicraft/posts/post-1.webp",
      "/seed_mau/handicraft/posts/post-2.webp",
      "/seed_mau/handicraft/posts/post-3.webp"
    ],
    "logos": [
      "/seed_mau/handicraft/logos/logo-1.webp",
      "/seed_mau/handicraft/logos/logo-2.webp",
      "/seed_mau/handicraft/logos/logo-3.webp"
    ],
    "gallery": [
      "/seed_mau/handicraft/gallery/gallery-1.webp",
      "/seed_mau/handicraft/gallery/gallery-2.webp",
      "/seed_mau/handicraft/gallery/gallery-3.webp",
      "/seed_mau/handicraft/gallery/gallery-4.webp"
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
      "Gốm",
      "Mây tre",
      "Đồ da",
      "Trang trí",
      "Quà tặng"
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
      "thủ công",
      "độc bản",
      "tinh xảo"
    ],
    "customFields": {
      "item": [
        "Đồ gốm",
        "Đồ mây tre",
        "Đồ da",
        "Trang trí",
        "Phụ kiện"
      ],
      "category": [
        "Gốm",
        "Mây tre",
        "Đồ da",
        "Trang trí",
        "Quà tặng"
      ],
      "brand": [
        "VietMart",
        "ZenHome",
        "Nova",
        "Lumia",
        "Sendo"
      ],
      "industry": [
        "Đồ thủ công"
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
            "image": "/seed_mau/handicraft/hero/1.webp",
            "link": "/products"
          },
          {
            "image": "/seed_mau/handicraft/hero/10.webp",
            "link": "/products"
          }
        ],
        "content": {
          "badge": "Nổi bật",
          "heading": "Đồ thủ công chất lượng",
          "description": "Sản phẩm thủ công, thiết kế độc bản.",
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
        "heading": "Sản phẩm đồ thủ công nổi bật",
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
        "heading": "Về Đồ thủ công",
        "content": "Sản phẩm thủ công, thiết kế độc bản.",
        "image": "/seed_mau/handicraft/gallery/gallery-1.webp"
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
