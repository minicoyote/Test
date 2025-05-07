import { Suspense } from "react"
import NewsScraperForm from "@/components/news-scraper-form"
import { ScrapedContentSkeleton } from "@/components/scraped-content"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-2 text-slate-800 dark:text-slate-100">News Scraper</h1>
        <p className="text-center mb-8 text-slate-600 dark:text-slate-300">
          Enter a URL to extract and display news content in a clean, readable format
        </p>

        <NewsScraperForm />

        <Suspense fallback={<ScrapedContentSkeleton />}>
          <div id="content-container" className="mt-8">
            {/* Content will be loaded here */}
          </div>
        </Suspense>
      </div>
    </main>
  )
}

