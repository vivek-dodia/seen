import InfiniteGallery from "@/components/InfiniteGallery"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Seen",
}

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
          <span className="italic">I watch;</span> therefore I remember
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
