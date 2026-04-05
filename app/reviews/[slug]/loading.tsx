export default function ReviewLoading() {
  return (
    <div className="bg-[#f5f2ea] min-h-screen px-6 py-12 md:px-12">
      <section className="mx-auto grid max-w-6xl gap-10 rounded-[32px] border border-black/10 bg-white/90 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] md:grid-cols-[1.05fr_0.95fr] md:p-12">
        <div className="aspect-[4/5] animate-pulse rounded-[24px] bg-stone-200" />

        <div className="flex flex-col justify-center">
          <div className="mb-4 h-4 w-28 animate-pulse rounded-full bg-stone-200" />
          <div className="mb-3 h-12 w-full animate-pulse rounded-2xl bg-stone-200" />
          <div className="mb-8 h-5 w-52 animate-pulse rounded-full bg-stone-200" />
          <div className="mb-6 h-px w-full bg-stone-200" />
          <div className="space-y-4">
            <div className="h-4 w-full animate-pulse rounded-full bg-stone-200" />
            <div className="h-4 w-full animate-pulse rounded-full bg-stone-200" />
            <div className="h-4 w-11/12 animate-pulse rounded-full bg-stone-200" />
            <div className="h-4 w-full animate-pulse rounded-full bg-stone-200" />
            <div className="h-4 w-4/5 animate-pulse rounded-full bg-stone-200" />
          </div>
        </div>
      </section>
    </div>
  )
}
