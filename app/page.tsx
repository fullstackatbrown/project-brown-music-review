import EmailSignup from "./components/EmailSignup";
import VinylScroller from "./components/VinylScroller";

export default function Home() {
  return (
    <>
      <VinylScroller />
      <div className="flex min-h-[200vh] flex-col items-center justify-center px-4">
        <h1 className="text-4xl font-bold">Brown Music Review</h1>
        <EmailSignup />
      </div>
    </>
  );
}
