"use client"
import Link from "next/link";
import Image from "next/image";
import bmr_logo from "@/public/bmr_logo.webp";

interface Page {
    name: string,
    path: string
}

const pages: Page[] = [
    {name: "Deep Dive", path: "/deepdive"},
    {name: "Opinions", path: "/opinions"},
    {name: "Narratives", path: "/narratives"},
    {name: "Hot Topics", path: "/hottopics"},
]

export default function Navbar() {
    return (<header className="flex fixed top-0 left-0 w-full z-50 bg-background py-7">
        <div className="fixed left-15">
            <Link href="/">
                <Image src={bmr_logo} alt="Brown Music Review logo" width={50}/>
            </Link>
        </div>
        <div className="fixed right-15 flex gap-15 items-center text-sm">
            {pages.map((page, i) => (
                <Link href={page.path} key={i} className="transition-colors hover:text-hover-color">
                    {page.name}
                </Link>
            ))}

            <button className="bg-foreground text-background rounded-sm py-1.5 px-3"
                onClick={() => alert("Button")}>
                Button
            </button>
        </div>
    </header>);
}