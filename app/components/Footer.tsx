import Link from "next/link";
import { FaInstagram } from "react-icons/fa";

const pageLinks = [
  { name: "Deep Dive", path: "/deepdive" },
  { name: "Narratives", path: "/narratives" },
  { name: "Hot Topics", path: "/hottopics" },
  { name: "Opinions", path: "/opinions" },
  { name: "About Us", path: "/about" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-black text-white py-12 px-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold italic tracking-wide">
            Brown Music Review
          </h2>
          <p className="text-sm text-white/70 leading-relaxed">
            A student-run music publication operated independently from Brown
            University.
          </p>
          <div className="flex gap-4 text-2xl mt-2">
            <Link
              href="https://www.instagram.com/brownmusicreview"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram className="hover:text-[#D20000] transition-colors" />
            </Link>
          </div>
        </div>

        {/* Pages */}
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold">Pages</h3>
          {pageLinks.map((page) => (
            <Link
              key={page.name}
              href={page.path}
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              {page.name}
            </Link>
          ))}
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold">Contact Us</h3>
          <Link
            href="mailto:brownmusicreview@gmail.com"
            className="text-sm text-white/70 hover:text-white transition-colors"
          >
            Email us
          </Link>
          <Link
            href="mailto:brownmusicreview@gmail.com?subject=Join%20Our%20Staff"
            className="text-sm text-white/70 hover:text-white transition-colors"
          >
            Join our staff
          </Link>
        </div>
      </div>
    </footer>
  );
}
