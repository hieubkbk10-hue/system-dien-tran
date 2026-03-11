import Link from 'next/link';

import type { InternalLinkItem } from '@/lib/seo/internal-links';

type InternalLinkClusterProps = {
  links: InternalLinkItem[];
  title?: string;
};

export default function InternalLinkCluster({ links, title = 'Khám phá thêm' }: InternalLinkClusterProps) {
  if (!links || links.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        Các trang liên quan giúp AI và người dùng hiểu rõ cấu trúc nội dung của bạn.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-xl border border-slate-200 px-4 py-3 transition hover:border-primary/60 dark:border-slate-800"
          >
            <div className="text-base font-semibold text-slate-900 dark:text-slate-100">
              {link.title}
            </div>
            {link.description && (
              <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {link.description}
              </div>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
