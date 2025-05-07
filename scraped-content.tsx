import { Skeleton } from "@/components/ui/skeleton"

export function ScrapedContentSkeleton() {
  return (
    <div className="mt-8 bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 space-y-4">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
    </div>
  )
}

export function ScrapedContent({ html }: { html: string }) {
  return (
    <div
      className="mt-8 bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 prose dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

