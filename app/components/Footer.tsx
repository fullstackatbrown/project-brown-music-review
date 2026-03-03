import Link from "next/link";
import { FaInstagram } from "react-icons/fa";
import { BsSubstack } from "react-icons/bs";

export default function Footer() {
    return (<div className="w-full bg-foreground text-background py-10 ">
        <div className="flex flex-col ml-15 gap-y-15 text-lg">
            <p>Brown Music Review</p>
            <div className="flex flex-row text-3xl gap-5">
                <Link href="https://www.instagram.com/brownmusicreview" target="_blank" rel="noopener noreferrer">
                    <FaInstagram className="transition-colors hover:text-hover-color"/>
                </Link>
                <Link href="https://brownmusicreview.substack.com/" target="_blank" rel="noopener noreferrer">
                    <BsSubstack className="transition-colors hover:text-hover-color"/>
                </Link>
            </div>
        </div>
    </div>);
}