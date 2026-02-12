import type { IndustryTemplate } from '../types';

export const industryTemplate: IndustryTemplate = {
  "key": "stationery",
  "name": "Văn phòng phẩm",
  "icon": "✏️",
  "description": "Dụng cụ học tập, văn phòng đầy đủ.",
  "category": "retail",
  "websiteTypes": [
    "catalog",
    "ecommerce"
  ],
  "saleMode": "cart",
  "productType": "physical",
  "businessType": "Store",
  "brandColor": "#d97706",
  "tags": [
    "văn phòng",
    "học tập",
    "tiện ích"
  ],
  "assets": {
    "hero": [
      "/seed_mau/stationery/hero/hero-1.jpg",
      "/seed_mau/stationery/hero/hero-2.jpg"
    ],
    "products": [
      "/seed_mau/stationery/products/product-1.jpg",
      "/seed_mau/stationery/products/product-2.jpg",
      "/seed_mau/stationery/products/product-3.jpg",
      "/seed_mau/stationery/products/product-4.jpg"
    ],
    "posts": [
      "/seed_mau/stationery/posts/post-1.jpg",
      "/seed_mau/stationery/posts/post-2.jpg",
      "/seed_mau/stationery/posts/post-3.jpg"
    ],
    "logos": [
      "/seed_mau/stationery/logos/logo-1.png",
      "/seed_mau/stationery/logos/logo-2.png",
      "/seed_mau/stationery/logos/logo-3.png"
    ],
    "gallery": [
      "/seed_mau/stationery/gallery/gallery-1.jpg",
      "/seed_mau/stationery/gallery/gallery-2.jpg",
      "/seed_mau/stationery/gallery/gallery-3.jpg",
      "/seed_mau/stationery/gallery/gallery-4.jpg"
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
      "Bút",
      "Sổ",
      "Giấy",
      "Dụng cụ",
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
      "văn phòng",
      "học tập",
      "tiện ích"
    ],
    "customFields": {
      "item": [
        "Bút",
        "Sổ tay",
        "Giấy",
        "Phụ kiện",
        "Balo"
      ],
      "category": [
        "Bút",
        "Sổ",
        "Giấy",
        "Dụng cụ",
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
        "Văn phòng phẩm"
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
            "image": "/seed_mau/stationery/hero/hero-1.jpg",
            "link": "/products"
          },
          {
            "image": "/seed_mau/stationery/hero/hero-2.jpg",
            "link": "/products"
          }
        ],
        "content": {
          "badge": "Nổi bật",
          "heading": "Văn phòng phẩm chất lượng",
          "description": "Dụng cụ học tập, văn phòng đầy đủ.",
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
        "heading": "Sản phẩm văn phòng phẩm nổi bật",
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
        "heading": "Về Văn phòng phẩm",
        "content": "Dụng cụ học tập, văn phòng đầy đủ.",
        "image": "/seed_mau/stationery/gallery/gallery-1.jpg"
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
