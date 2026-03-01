import Image from "next/image";
import albumArt from "./assets/image 5.png";
import albumArt_2 from "./assets/Screenshot_2026-02-22_at_11.25.36_AM-removebg-preview 1.png";
import blackEllipse from "./assets/Ellipse 4.png";
import redEllipse from "./assets/Ellipse 5.png";

export default function ReviewPage() {
  return (
    <div>
      {/*white bg box up top*/}
      <section className="bg-white px-16 py-12">
        <div className="flex items-start gap-8 max-w-5xl mx-auto">

          {/*image*/}
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

          {/*album info*/}
          <div className="flex-1 flex flex-col items-center pt-4">
            <h1 className="text-6xl font-light tracking-wide">album</h1>
            <h2 className="text-lg font-normal mt-1">artist</h2>

            <div className="mt-8 text-sm text-center space-y-1 text-gray-800">
              <p>genre:</p>
              <p>label:</p>
              <p className="font-bold">release date</p>
            </div>

            <div className="mt-8 flex items-start gap-6">
              {/*logo placeholder*/}
              <div className="flex flex-col items-center gap-1">
                <div className="w-20 h-20 bg-gray-200 flex items-center justify-center text-xs text-gray-500 text-center leading-tight"></div>
                <span className="text-xs text-gray-500">readership ranking</span>
              </div>

              {/*rating*/}
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full border-2 border-red-400 flex items-center justify-center text-red-400 text-xl font-light">
                  9.0
                </div>

                <div className="relative w-20 h-8">
                  <Image src={blackEllipse} alt="" fill className="object-contain" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-7 h-3">
                      <Image src={redEllipse} alt="" fill className="object-contain" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/*black bg section (article)*/}
      <section className="bg-black text-white px-16 py-16 min-h-[60vh]">
        <div className="flex justify-between items-start max-w-5xl mx-auto">

          <div>
            <h2 className="text-6xl font-light">title</h2>
            <p className="text-base text-gray-300 mt-2">(can link to article)</p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="w-36 h-36 bg-gray-400" />
            <div className="w-36 h-36 bg-gray-400" />
            <div className="w-36 h-36 bg-gray-400" />
          </div>

        </div>
      </section>
    </div>
  );
}
