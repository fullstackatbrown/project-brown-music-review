import Image, { StaticImageData } from "next/image";
import albumArt_2 from "../assets/Screenshot_2026-02-22_at_11.25.36_AM-removebg-preview 1.png";

interface ArticleCard {
    imagePath: string,
    title: string,
    date?: string,
    blurb?: string,
    author: string
}

const sampleArticle: ArticleCard = {
    imagePath: "/Wavejobim.jpg",
    title: "Rihanna Unharmed After Shots Fired at Her L.A. Home, Suspect in Custody",
    date: "November 24, 2026",
    blurb: "short blurb about the article short blurb about the article short blurb about the article",
    author: "author"
}

const sampleArticle2: ArticleCard = {
    imagePath: "/Pink-Floyd-Dark-Side-Of-The-Moon.png",
    title: "Article Title",
    blurb: "short blurb about the article short blurb about the article short blurb about the article",
    author: "author"
}

const sampleArticles: ArticleCard[] = [
    sampleArticle,
    sampleArticle2,
    sampleArticle,
    sampleArticle2
]

const allArticles: ArticleCard[] = [
    sampleArticle2,
    sampleArticle,
    sampleArticle2,
    sampleArticle2,
    sampleArticle,
    sampleArticle,
    sampleArticle2,
    sampleArticle2
]

function FeaturedHotTopicCard({card}: {card: ArticleCard}) {
    return (
        <div className="flex flex-col shrink-0 gap-2 w-[250px]">
            <Image src={card.imagePath} alt={card.title}
                width={250} height={250}
                className="rounded-2xl border-2 border-black"/>
            
            <div className="text-center w-full px-2">
                <p className="font-bold uppercase text-xl leading-tight break-words">
                    {card.title}
                </p>

                <p className="text-sm italic">
                    {card.author}
                </p>
            </div>
        </div>
    );
}

function FeaturedHotTopics() {
    return (
        <div className="flex overflow-x-auto max-w-full m-10 gap-5 pb-4 flex-nowrap">
            {sampleArticles.map((sampleArticle, i) => (
                <FeaturedHotTopicCard key={i} card={sampleArticle}/>
            ))}
        </div>
    );
}


function HotTopicCard({card}: {card: ArticleCard}) {
    return (
        <div className="flex flex-col items-center border-2 border-black gap-2 rounded-2xl overflow-hidden">
            <Image src={card.imagePath} alt={card.title}
                width={400} height={400} className="w-full h-auto object-cover"/>

            <p className="font-bold text-xl px-5">
                {card.title}
            </p>

            <p className="px-5">
                {card.blurb}
            </p>

            <p className="text-sm italic">
                by {card.author}
            </p>
        </div>
    );
}

function AllHotTopics() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 px-20 py-10">
            {allArticles.map((article, i) => (
                <HotTopicCard key={i} card={article}/>
            ))}
        </div>
    )
}

function BannerArticle({card}: {card: ArticleCard}) {    
    return (<div className="flex flex-row bg-black text-white px-5 gap-5 py-10 justify-center">
        <div className="flex flex-col w-[30%] text-right gap-y-5">
            <p className="text-4xl font-bold">
                {card.title}
            </p>

            <p className="italic">
                by {card.author}
            </p>
        </div>

        <div className="w-[30%]">
            <Image
                src={card.imagePath} alt={card.title} width={400} height={400} className="rounded-2xl"
            />
        </div>

        <div className="flex flex-col w-[30%] gap-y-5">
            <p className="text-2xl font-bold">
                {card.date}
            </p>
            
            <p>
                {card.blurb}
            </p>

            <a href="">
                <p className="font-bold text-right text-lg hover:text-blue-300 transition-colors duration-100">
                    read more →
                </p>
            </a>
        </div>
    </div>);
}

export default function Home() {
    return (
    <div className="flex flex-col">
        <div className="flex flex-row mt-25 w-full">
            <div className="w-[50%]">
              <Image
                src={albumArt_2}
                alt=""
                className="w-full h-auto"
              />
            </div>

            <div className="flex flex-col min-w-0 w-full text-right">
                <div className="border-b-2 mr-10 mt-5 ml-15">
                    <h1 className="text-red-600 font-bold text-5xl  my-3">
                        Hot Topics
                    </h1>
                </div>

                <div className="mr-10 mt-5 font-bold">
                    <p>
                        short blurb about what hot topics is about
                    </p>

                    <p>
                        filler text filler text
                    </p>
                </div>

                <FeaturedHotTopics/>
            </div>
        </div>

        <BannerArticle card={sampleArticle}/>

        <AllHotTopics/>
    </div>
    );
}