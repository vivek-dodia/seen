import InfiniteGallery from "@/components/InfiniteGallery"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Seen",
}

const taglines = [
  { italic: "I binge;", rest: "therefore I exist" },
  { italic: "I watched it once;", rest: "therefore I'm an expert" },
  { italic: "I streamed;", rest: "therefore it happened" },
  { italic: "I remember nothing;", rest: "therefore I watched" },
  { italic: "I fell asleep;", rest: "therefore I watched" },
  { italic: "I saw the first 20 minutes;", rest: "therefore I saw it all" },
  { italic: "I started it;", rest: "therefore I finished it" },
  { italic: "I added it to my list;", rest: "therefore I will watch it" },
  { italic: "I screenshotted the scene;", rest: "therefore I understand the whole show" },
  { italic: "I read the Wikipedia plot;", rest: "therefore I watched it" },
  { italic: "I paused it twice;", rest: "therefore I was paying attention" },
  { italic: "I skipped the intro;", rest: "therefore I saved time" },
  { italic: "I rage-quit;", rest: "therefore I loved it" },
  { italic: "I told my friend about it;", rest: "therefore I watched it" },
  { italic: "I saw a TikTok clip;", rest: "therefore I'm caught up" },
  { italic: "I turned it on in the background;", rest: "therefore I absorbed it" },
  { italic: "I had it open on my second monitor;", rest: "therefore I watched" },
  { italic: "I commented on the Reddit thread;", rest: "therefore I was there" },
  { italic: "I didn't finish it;", rest: "therefore I watched enough" },
  { italic: "I pretended to watch it;", rest: "therefore nobody knew the difference" },
  { italic: "I watched the last 10 minutes;", rest: "therefore I know how it ends" },
  { italic: "I let it autoplay;", rest: "therefore I watched five episodes" },
]

export default function Home() {
  const sampleImages = [
    { src: "/1.webp", alt: "Image 1" },
    { src: "/2.webp", alt: "Image 2" },
    { src: "/3.webp", alt: "Image 3" },
    { src: "/4.webp", alt: "Image 4" },
    { src: "/5.webp", alt: "Image 5" },
    { src: "/6.webp", alt: "Image 6" },
    { src: "/7.webp", alt: "Image 7" },
    { src: "/8.webp", alt: "Image 8" },
  ]

  const randomTagline = taglines[Math.floor(Math.random() * taglines.length)]

  return (
    <main className="min-h-screen ">
      <InfiniteGallery
        images={sampleImages}
        speed={1.2}
        zSpacing={3}
        visibleCount={12}
        falloff={{ near: 0.8, far: 14 }}
        className="h-screen w-full rounded-lg overflow-hidden"
      />
      <div className="h-screen inset-0 pointer-events-none fixed flex items-center justify-center text-center px-3 mix-blend-exclusion text-white">
        <h1 className="font-serif text-4xl md:text-7xl tracking-tight">
          <span className="italic">{randomTagline.italic}</span> {randomTagline.rest}
        </h1>
      </div>

      <div className="fixed top-1/2 left-0 right-0 flex justify-center z-10 mt-32">
        <Link
          href="/seen"
          className="px-10 py-4 bg-white/5 backdrop-blur-md border border-white/20 text-white font-serif text-2xl italic tracking-wide hover:bg-white/10 hover:scale-105 transition-all duration-300"
        >
          Seen
        </Link>
      </div>

      <div className="text-center fixed bottom-10 left-0 right-0 font-mono uppercase text-[11px] font-semibold">
        <p>Use mouse wheel, arrow keys, or touch to navigate</p>
        <p className=" opacity-60">Auto-play resumes after 3 seconds of inactivity</p>
      </div>
    </main>
  )
}
