import Image from "next/image";
import albumArt from "../../assets/image 5.png";
import albumArt_2 from "../../assets/Screenshot_2026-02-22_at_11.25.36_AM-removebg-preview 1.png";

export default function ReviewPage() {
  return (
    <div>
      {/* white bg box up top */}
      <section className="bg-white px-16 py-12">
        <div className="flex items-start gap-8 max-w-5xl mx-auto">

          {/* image */}
          <div className="relative w-[55%] shrink-0">
            <Image
              src={albumArt}
              alt="album-cover"
              className="w-full h-auto"
            />
            <div className="absolute -top-6 right-[-6%] w-[38%]">
              <Image
                src={albumArt_2}
                alt=""
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* review content */}
          <div className="flex flex-col justify-center pt-8">
            <span className="text-xs font-mono tracking-widest uppercase text-red-600 mb-2">
              Album Review
            </span>
            <h1 className="text-4xl font-bold font-serif mb-2">
              Album Name
            </h1>
            <p className="text-sm text-gray-500 mb-6">
              Reviewed by <strong className="text-black">Author Name</strong>
            </p>
            <div className="w-full h-px bg-gray-200 mb-6" />
            <p className="text-base leading-relaxed text-gray-800">
              This is where the review body text will go. It will eventually
              be pulled from the CMS and rendered here dynamically.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}