import eboardPic1 from '../assets/eboardPic1.jpg';

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen items-center pt-24 pb-24">
            <span className="text-xs font-mono tracking-widest uppercase text-red-600 mb-2">
                About Us
            </span>
            <h2 className="text-4xl font-bold font-serif mb-2">We are Brown Music Review.</h2>

            <div className="w-full max-w-3xl space-y-4">
                <p className="text-base leading-relaxed text-gray-800">
                    BMR is Brown University’s premier music publication, and simply put, we love music. We love listening to it, talking about it, and forming strong (but malleable) opinions on it. If that sounds like you, write for us!
                </p>
                <p className="text-base leading-relaxed text-gray-800 italic">
                    The content of all News & Publications groups recognized by USC is generated independently from Brown University. The statements, views, opinions, and information contained in the publication are personal to those of the authors and student group and do not necessarily reflect those of Brown University. The publication is not reviewed, approved, or endorsed by Brown University or its faculty or staff.
                </p>
            </div>

            <span className="text-xs font-mono tracking-widest uppercase text-red-600 mb-2 mt-16">
                Meet our staff
            </span>
            <h2 className="text-4xl font-bold font-serif mb-2">E-Board</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mt-10">

                <div className="flex flex-col">
                    <div className="w-full mb-4">
                        <img src={eboardPic1.src} className="w-full aspect-square object-cover" />
                    </div>
                    <h3 className="text-gray-500 font-medium mb-1 tracking-wide">Thomas</h3>
                    <p className="text-gray-400 text-sm">bio</p>
                </div>

                <div className="flex flex-col">
                    <div className="w-full mb-4">
                        <img src={eboardPic1.src} className="w-full aspect-square object-cover" />
                    </div>
                    <h3 className="text-gray-500 font-medium mb-1 tracking-wide">Thomas</h3>
                    <p className="text-gray-400 text-sm">bio</p>
                </div>

                <div className="flex flex-col">
                    <div className="w-full mb-4">
                        <img src={eboardPic1.src} className="w-full aspect-square object-cover" />
                    </div>
                    <h3 className="text-gray-500 font-medium mb-1 tracking-wide">Thomas</h3>
                    <p className="text-gray-400 text-sm">bio</p>
                </div>

            </div>
        </div>
    );
}