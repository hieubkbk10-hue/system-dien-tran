import { getConvexClient } from '@/lib/convex';
import { api } from '@/convex/_generated/api';
import { notFound } from 'next/navigation';

interface Props { params: Promise<{ slug: string }> }

export default async function ComparePage({ params }: Props) {
  const { slug } = await params;
  const page = await getConvexClient().query(api.landingPages.getBySlug, { slug });
  if (!page || page.landingType !== 'compare') notFound();
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {page.heroImage && <img src={page.heroImage} alt={page.title} className="w-full h-64 object-cover rounded-lg mb-8" />}
      <h1 className="text-4xl font-bold mb-4">{page.title}</h1>
      <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">{page.summary}</p>
      {page.content && <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: page.content }} />}
      {page.faqItems && page.faqItems.length > 0 && (
        <div className="mt-12"><h2 className="text-2xl font-bold mb-6">Câu hỏi thường gặp</h2>
          <div className="space-y-4">{page.faqItems.map((faq, i) => (
            <details key={i} className="border rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">{faq.question}</summary>
              <p className="mt-2 text-slate-600 dark:text-slate-400">{faq.answer}</p>
            </details>))}</div>
        </div>
      )}
    </div>
  );
}
