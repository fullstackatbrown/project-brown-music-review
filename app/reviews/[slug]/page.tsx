import { getArticleBySlug } from "@/lib/cosmic";
import Image from "next/image";

export default async function ReviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const response = await getArticleBySlug(slug);
  const article = response.object;

  if (!article) return <div>Not found</div>;

  const meta = article.metadata as any;

  return (
    <div>
      {/* white bg box up top */}
      <section className="bg-white px-16 py-12">
        <div className="flex items-start gap-8 max-w-5xl mx-auto">

          {/* image */}
          {meta.cover_image?.imgix_url && (
            <div className="relative w-[55%] shrink-0">
              <Image
                src={meta.cover_image.imgix_url}
                alt={article.title}
                className="w-full h-auto"
                width={600}
                height={600}
              />
            </div>
          )}

          {/* review content */}
          <div className="flex flex-col justify-center pt-8">
            <span className="text-xs font-mono tracking-widest uppercase text-red-600 mb-2">
              {article.type}
            </span>
            <h1 className="text-4xl font-bold font-serif mb-2">
              {article.title}
            </h1>
            <p className="text-sm text-gray-500 mb-6">
              Reviewed by <strong className="text-black">{meta.writer}</strong>
            </p>
            <div className="w-full h-px bg-gray-200 mb-6" />
            <div className="text-base leading-relaxed text-gray-800" dangerouslySetInnerHTML={{ __html: meta.body_content || "" }} />
          </div>
        </div>
      </section>
    </div>
  );
}