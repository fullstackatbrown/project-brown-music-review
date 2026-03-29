import Image, { StaticImageData } from "next/image";
import albumArt_2 from "../assets/Screenshot_2026-02-22_at_11.25.36_AM-removebg-preview 1.png";

interface ArticleCard {
    imagePath: string,
    title: string,
    blurb?: string,
    author: string
}

const sampleArticle: ArticleCard = {
    imagePath: "/Wavejobim.jpg",
    title: "Article Title",
    blurb: "short blurb about the article short blurb about the article short blurb about the article",
    author: "author"
}

const sampleArticles: ArticleCard[] = [
    sampleArticle,
    sampleArticle,
    sampleArticle,
    sampleArticle
]

const allArticles: ArticleCard[] = [
    sampleArticle,
    sampleArticle,
    sampleArticle,
    sampleArticle,
    sampleArticle,
    sampleArticle,
    sampleArticle,
    sampleArticle
]

function FeaturedHotTopicCard({card}: {card: ArticleCard}) {
    return (
        <div className="flex flex-col shrink-0 gap-2 items-center">
            <Image src={card.imagePath} alt={card.title}
                width={250} height={250}
                className="rounded-2xl border-2 border-black"/>
            
            <p className="font-bold uppercase text-xl">
                {card.title}
            </p>

            <p className="text-sm italic">
                {card.author}
            </p>
        </div>
    );
}

function FeaturedHotTopics() {
    return (
        <div className="flex overflow-x-auto m-10 gap-5">
            {sampleArticles.map((sampleArticle, i) => (
                <FeaturedHotTopicCard key={i} card={sampleArticle}/>
            ))}
        </div>
    );
}

function HotTopicCard({card}: {card: ArticleCard}) {
    return (
        <div className="flex flex-col items-center border-2 border-black w-fit gap-2">
            <Image src={card.imagePath} alt={card.title}
                width={250} height={250}/>

            <p className="font-bold text-xl">
                {card.title}
            </p>

            <p>
                {card.blurb}
            </p>

            <p className="text-sm italic">
                {card.author}
            </p>
        </div>
    );
}

function AllHotTopics() {
    return (
        <div className="grid grid-cols-3">
            {allArticles.map((article, i) => (
                <HotTopicCard key={i} card={article}/>
            ))}
        </div>
    )
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

            <div className="flex flex-col w-full text-right">
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
        <AllHotTopics/>
    </div>
    );
}