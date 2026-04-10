import Image from "next/image";

export default function About() {
  return (
    <div className="flex flex-col items-center px-6 py-12">
      <span className="text-xs font-mono tracking-widest uppercase text-red-600 mb-2">
        About Us
      </span>
      <h2 className="text-4xl font-bold font-serif mb-2">
        We are Brown Music Review.
      </h2>

      <div className="w-full max-w-3xl space-y-4">
        <p className="text-base leading-relaxed text-gray-800">
          BMR is Brown University&apos;s premier music publication, and simply
          put, we love music. We love listening to it, talking about it, and
          forming strong (but malleable) opinions on it. If that sounds like you,
          write for us!
        </p>
        <p className="text-base leading-relaxed text-gray-800 italic">
          The content of all News &amp; Publications groups recognized by USC is
          generated independently from Brown University. The statements, views,
          opinions, and information contained in the publication are personal to
          those of the authors and student group and do not necessarily reflect
          those of Brown University. The publication is not reviewed, approved, or
          endorsed by Brown University or its faculty or staff.
        </p>
      </div>

      <span className="text-xs font-mono tracking-widest uppercase text-red-600 mb-2 mt-10">
        Meet our staff
      </span>
      <h2 className="text-4xl font-bold font-serif mb-8">
        Eboard? Writers?
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 max-w-4xl">
        {/* Staff member */}
        <div className="flex flex-col items-center text-center">
          <div className="w-32 h-32 rounded-full overflow-hidden mb-3 border-2 border-gray-200">
            <Image
              src="/staff-writer.png"
              alt="Staff writer"
              width={128}
              height={128}
              className="object-cover w-full h-full"
            />
          </div>
          <p className="font-semibold text-sm">Writer</p>
          <p className="text-xs text-gray-500">Staff Writer</p>
        </div>

        {/* Placeholder slots for future staff */}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex flex-col items-center text-center opacity-30"
          >
            <div className="w-32 h-32 rounded-full bg-gray-200 mb-3 border-2 border-gray-200" />
            <p className="font-semibold text-sm">Name</p>
            <p className="text-xs text-gray-500">Role</p>
          </div>
        ))}
      </div>
    </div>
  );
}
