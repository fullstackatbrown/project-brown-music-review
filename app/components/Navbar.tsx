import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
      <div className="w-16 h-10 bg-gray-200 flex items-center justify-center text-sm text-gray-500">
        logo
      </div>

      <div className="flex items-center gap-6">
        <Link href="/" className="text-sm text-gray-800 hover:underline">
          Page
        </Link>
        <Link href="/" className="text-sm text-gray-800 hover:underline">
          Page
        </Link>
        <Link href="/" className="text-sm text-gray-800 hover:underline">
          Page
        </Link>
        <button className="bg-black text-white text-sm px-4 py-2 rounded-md">
          Button
        </button>
      </div>
    </nav>
  );
}
