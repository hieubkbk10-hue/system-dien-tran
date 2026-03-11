export type LandingType =
  | 'feature'
  | 'use-case'
  | 'solution'
  | 'compare'
  | 'integration'
  | 'template'
  | 'guide';

export type ModuleSeed = {
  category: 'content' | 'commerce' | 'user' | 'system' | 'marketing';
  description: string;
  key: string;
  name: string;
};

export type ProgrammaticLandingItem = {
  content: string;
  faqItems?: Array<{ question: string; answer: string }>;
  landingType: LandingType;
  order?: number;
  primaryIntent?: string;
  relatedProductSlugs?: string[];
  relatedServiceSlugs?: string[];
  relatedSlugs?: string[];
  slug: string;
  summary: string;
  title: string;
};

export type ProgrammaticLandingPlan = {
  items: ProgrammaticLandingItem[];
};

type LandingInput = {
  homeComponents: Array<{ title: string; type: string }>;
  modules: ModuleSeed[];
  posts: Array<{ slug: string; title: string }>;
  products: Array<{ name: string; slug: string }>;
  services: Array<{ slug: string; title: string }>;
  siteName: string;
};

const CATEGORY_LABELS: Record<ModuleSeed['category'], string> = {
  commerce: 'Bán hàng & thương mại',
  content: 'Quản lý nội dung',
  marketing: 'Marketing & tăng trưởng',
  system: 'Vận hành hệ thống',
  user: 'Quản trị người dùng',
};

const slugify = (value: string): string => value
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[đĐ]/g, 'd')
  .replace(/[^a-z0-9\s-]/g, '')
  .replace(/\s+/g, '-')
  .replace(/-+/g, '-')
  .replace(/^-|-$/g, '');

const buildList = (items: string[]): string => {
  if (items.length === 0) {
    return '<p>Hiện chưa có dữ liệu để hiển thị.</p>';
  }
  return `<ul>${items.map((item) => `<li>${item}</li>`).join('')}</ul>`;
};

const buildSection = (title: string, content: string): string => (
  `<h2>${title}</h2>${content}`
);

export const estimateContentLength = (content: string): number => (
  content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().length
);

const attachRelatedSlugs = (items: ProgrammaticLandingItem[]): ProgrammaticLandingItem[] => {
  const grouped = new Map<LandingType, string[]>();
  for (const item of items) {
    const list = grouped.get(item.landingType) ?? [];
    list.push(item.slug);
    grouped.set(item.landingType, list);
  }

  return items.map((item) => {
    const candidates = (grouped.get(item.landingType) ?? []).filter((slug) => slug !== item.slug);
    return {
      ...item,
      relatedSlugs: candidates.slice(0, 4),
    };
  });
};

const buildFeatureItems = ({ modules, siteName, products, services }: LandingInput): ProgrammaticLandingItem[] => {
  return modules.map((module, index) => {
    const productList = buildList(products.slice(0, 3).map((item) => item.name));
    const serviceList = buildList(services.slice(0, 3).map((item) => item.title));
    const content = [
      buildSection(
        `Tổng quan tính năng ${module.name}`,
        `<p>${module.description} cho ${siteName}. Tính năng này giúp bạn triển khai nhanh, nhất quán và dễ mở rộng.</p>`
      ),
      buildSection(
        'Lợi ích chính',
        buildList([
          `Chuẩn hóa quy trình ${module.name.toLowerCase()} theo COC`,
          'Giảm thao tác thủ công và sai sót vận hành',
          'Tối ưu tốc độ triển khai và onboarding',
        ])
      ),
      buildSection('Ứng dụng thực tế', `<p>Phù hợp khi bạn cần quản lý ${module.name.toLowerCase()} ở quy mô tăng trưởng.</p>`),
      buildSection('Dữ liệu liên quan', `<p>Sản phẩm tiêu biểu:</p>${productList}<p>Dịch vụ liên quan:</p>${serviceList}`),
      buildSection('Gợi ý triển khai', '<p>Bật module, cấu hình tối thiểu, và theo dõi hiệu quả qua dashboard.</p>'),
    ].join('');

    return {
      content,
      faqItems: [
        {
          question: `Tính năng ${module.name} dùng để làm gì?`,
          answer: module.description || `Giúp bạn vận hành ${module.name.toLowerCase()} hiệu quả hơn.`,
        },
        {
          question: `Có cần thiết lập phức tạp không?`,
          answer: 'Không, hệ thống đã chuẩn hóa theo mô-đun để bạn bật là dùng ngay.',
        },
      ],
      landingType: 'feature',
      order: index + 1,
      primaryIntent: `${module.name.toLowerCase()} feature`,
      relatedProductSlugs: products.slice(0, 3).map((item) => item.slug),
      relatedServiceSlugs: services.slice(0, 3).map((item) => item.slug),
      slug: `feature-${slugify(module.key)}`,
      summary: module.description || `Tính năng ${module.name} giúp vận hành nhanh và chuẩn hóa.`,
      title: `Tính năng ${module.name}`,
    };
  });
};

const buildUseCaseItems = ({ modules, siteName }: LandingInput): ProgrammaticLandingItem[] => {
  const grouped = modules.reduce<Record<string, ModuleSeed[]>>((acc, module) => {
    acc[module.category] = acc[module.category] ?? [];
    acc[module.category].push(module);
    return acc;
  }, {});

  return Object.entries(grouped).map(([category, list], index) => {
    const label = CATEGORY_LABELS[category as ModuleSeed['category']];
    const moduleList = buildList(list.map((module) => `${module.name}: ${module.description}`));
    const content = [
      buildSection('Bối cảnh sử dụng', `<p>${label} là nhu cầu cốt lõi của hầu hết đội ngũ triển khai ${siteName}.</p>`),
      buildSection('Vấn đề thường gặp', buildList([
        'Thiếu chuẩn hóa giữa các đội nhóm',
        'Khó theo dõi trạng thái và hiệu suất',
        'Tốn thời gian khi mở rộng quy mô',
      ])),
      buildSection('Giải pháp đề xuất', `<p>Kích hoạt các module dưới đây để xử lý toàn bộ luồng ${label.toLowerCase()}.</p>${moduleList}`),
      buildSection('Kết quả kỳ vọng', '<p>Giảm thời gian xử lý, tăng độ chính xác và giữ trải nghiệm nhất quán.</p>'),
    ].join('');

    return {
      content,
      landingType: 'use-case',
      order: index + 1,
      primaryIntent: `${label.toLowerCase()} use case`,
      slug: `use-case-${slugify(category)}`,
      summary: `Use-case tập trung vào ${label.toLowerCase()} cho ${siteName}.`,
      title: `Trường hợp sử dụng: ${label}`,
    };
  });
};

const buildSolutionItems = ({ modules, siteName }: LandingInput): ProgrammaticLandingItem[] => {
  const grouped = modules.reduce<Record<string, ModuleSeed[]>>((acc, module) => {
    acc[module.category] = acc[module.category] ?? [];
    acc[module.category].push(module);
    return acc;
  }, {});

  return Object.entries(grouped).map(([category, list], index) => {
    const label = CATEGORY_LABELS[category as ModuleSeed['category']];
    const moduleList = buildList(list.map((module) => module.name));
    const content = [
      buildSection('Giải pháp tổng thể', `<p>${siteName} cung cấp giải pháp ${label.toLowerCase()} end-to-end để vận hành nhanh hơn.</p>`),
      buildSection('Các module cấu thành', moduleList),
      buildSection('Tại sao hiệu quả', buildList([
        'Thiết kế theo chuẩn dữ liệu thống nhất',
        'Tự động hóa luồng thao tác chính',
        'Dễ mở rộng khi thêm module mới',
      ])),
      buildSection('Lộ trình triển khai', '<p>Bật module theo thứ tự ưu tiên, cấu hình tối thiểu và đo hiệu suất sau 7 ngày.</p>'),
    ].join('');

    return {
      content,
      landingType: 'solution',
      order: index + 1,
      primaryIntent: `${label.toLowerCase()} solution`,
      slug: `solution-${slugify(category)}`,
      summary: `Giải pháp ${label.toLowerCase()} cho ${siteName} dựa trên module bật.`,
      title: `Giải pháp ${label}`,
    };
  });
};

const buildCompareItems = ({ modules, siteName }: LandingInput): ProgrammaticLandingItem[] => {
  const moduleList = buildList(modules.map((module) => module.name));
  const content = [
    buildSection('So sánh phương án triển khai', `<p>So sánh giữa triển khai thủ công và ${siteName} theo module chuẩn hóa.</p>`),
    buildSection('Các module có thể bật', moduleList),
    buildSection('Điểm khác biệt', buildList([
      'Chuẩn dữ liệu và metadata nhất quán',
      'Tự động sinh landing pages theo module',
      'Giảm rủi ro khi scale đội ngũ',
    ])),
    buildSection('Khi nào nên dùng', '<p>Khi bạn cần mở rộng nhanh hoặc thiếu nguồn lực SEO chuyên sâu.</p>'),
  ].join('');

  return [
    {
      content,
      landingType: 'compare',
      primaryIntent: 'programmatic seo comparison',
      slug: 'compare-modules',
      summary: `So sánh cách triển khai module chuẩn hóa với cách thủ công cho ${siteName}.`,
      title: `So sánh triển khai module ${siteName}`,
    },
  ];
};

const buildIntegrationItems = ({ modules, siteName }: LandingInput): ProgrammaticLandingItem[] => {
  const candidates = modules.filter((module) => (
    module.category === 'system'
    || module.key.includes('integration')
    || module.key.includes('analytics')
    || module.key.includes('notification')
  ));

  return candidates.map((module, index) => {
    const content = [
      buildSection('Tổng quan tích hợp', `<p>${siteName} hỗ trợ tích hợp ${module.name} để đồng bộ dữ liệu và báo cáo.</p>`),
      buildSection('Giá trị mang lại', buildList([
        'Đồng bộ dữ liệu theo chuẩn',
        'Tự động hóa thông báo và tracking',
        'Giảm rủi ro vận hành thủ công',
      ])),
      buildSection('Cách kích hoạt', '<p>Bật module, cấu hình thông số tối thiểu và kiểm tra kết nối.</p>'),
    ].join('');

    return {
      content,
      landingType: 'integration',
      order: index + 1,
      primaryIntent: `${module.name.toLowerCase()} integration`,
      slug: `integration-${slugify(module.key)}`,
      summary: `Tích hợp ${module.name} để mở rộng khả năng vận hành ${siteName}.`,
      title: `Tích hợp ${module.name}`,
    };
  });
};

const buildTemplateItems = ({ homeComponents, siteName }: LandingInput): ProgrammaticLandingItem[] => {
  return homeComponents.slice(0, 6).map((component, index) => {
    const content = [
      buildSection('Mô tả template', `<p>Mẫu ${component.title} được tối ưu cho ${siteName} và có thể bật nhanh trong 1 ngày.</p>`),
      buildSection('Nội dung chính', buildList([
        'Bố cục CTA rõ ràng, ưu tiên mobile-first',
        'Tích hợp module liên quan để tăng chuyển đổi',
        'Dễ tùy biến theo brand hiện tại',
      ])),
      buildSection('Khi nào nên dùng', '<p>Phù hợp khi bạn cần triển khai landing nhanh cho chiến dịch ngắn hạn.</p>'),
    ].join('');

    return {
      content,
      landingType: 'template',
      order: index + 1,
      primaryIntent: `${component.title.toLowerCase()} template`,
      slug: `template-${slugify(component.type)}`,
      summary: `Template ${component.title} tối ưu chuyển đổi cho ${siteName}.`,
      title: `Template ${component.title}`,
    };
  });
};

const buildGuideItems = ({ modules, posts, siteName }: LandingInput): ProgrammaticLandingItem[] => {
  return modules.slice(0, 6).map((module, index) => {
    const postList = buildList(posts.slice(0, 3).map((post) => post.title));
    const content = [
      buildSection('Mục tiêu hướng dẫn', `<p>Hướng dẫn nhanh cách bật ${module.name} trong ${siteName} và tối ưu kết quả.</p>`),
      buildSection('Các bước chính', buildList([
        'Bật module và cấu hình trường dữ liệu bắt buộc',
        'Nhập dữ liệu mẫu và kiểm tra hiển thị',
        'Đo hiệu quả bằng dashboard và điều chỉnh',
      ])),
      buildSection('Tài nguyên liên quan', `<p>Bài viết liên quan:</p>${postList}`),
      buildSection('Lưu ý khi triển khai', '<p>Ưu tiên dữ liệu thật, tránh để trống và kiểm tra lại metadata.</p>'),
    ].join('');

    return {
      content,
      landingType: 'guide',
      order: index + 1,
      primaryIntent: `${module.name.toLowerCase()} setup guide`,
      slug: `guide-${slugify(module.key)}`,
      summary: `Hướng dẫn triển khai ${module.name} nhanh trong ${siteName}.`,
      title: `Hướng dẫn ${module.name}`,
    };
  });
};

export const buildProgrammaticLandingPlan = (input: LandingInput): ProgrammaticLandingPlan => {
  const modules = input.modules.slice(0, 24);
  const items: ProgrammaticLandingItem[] = [
    ...buildFeatureItems({ ...input, modules }),
    ...buildUseCaseItems({ ...input, modules }),
    ...buildSolutionItems({ ...input, modules }),
    ...buildCompareItems({ ...input, modules }),
    ...buildIntegrationItems({ ...input, modules }),
    ...buildTemplateItems(input),
    ...buildGuideItems({ ...input, modules }),
  ];

  return {
    items: attachRelatedSlugs(items),
  };
};
