"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { scrapeUrl } from "@/app/actions"
import { AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function NewsScraperForm() {
  const router = useRouter()
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fontSize, setFontSize] = useState("medium")
  const [darkMode, setDarkMode] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Basic URL validation
    if (!url.trim()) {
      setError("Please enter a URL")
      return
    }

    try {
      // Add http:// if missing
      let processedUrl = url
      if (!/^https?:\/\//i.test(url)) {
        processedUrl = "https://" + url
      }

      setIsLoading(true)
      const result = await scrapeUrl(processedUrl, fontSize, darkMode)

      if (result.error) {
        setError(result.error)
      } else {
        // Update the content container with the scraped content
        const contentContainer = document.getElementById("content-container")
        if (contentContainer) {
          contentContainer.innerHTML = result.html || ""

          // Apply font size to the content
          if (fontSize === "small") {
            contentContainer.classList.add("text-sm")
            contentContainer.classList.remove("text-base", "text-lg", "text-xl")
          } else if (fontSize === "medium") {
            contentContainer.classList.add("text-base")
            contentContainer.classList.remove("text-sm", "text-lg", "text-xl")
          } else if (fontSize === "large") {
            contentContainer.classList.add("text-lg")
            contentContainer.classList.remove("text-sm", "text-base", "text-xl")
          } else if (fontSize === "x-large") {
            contentContainer.classList.add("text-xl")
            contentContainer.classList.remove("text-sm", "text-base", "text-lg")
          }

          // Apply dark mode if selected
          if (darkMode) {
            document.documentElement.classList.add("dark")
          } else {
            document.documentElement.classList.remove("dark")
          }
        }

        router.refresh()
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="url" className="text-sm font-medium text-slate-700 dark:text-slate-200">
            News Article URL
          </label>
          <div className="flex space-x-2">
            <Input
              id="url"
              type="text"
              placeholder="https://example.com/article"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scraping...
                </>
              ) : (
                "Scrape"
              )}
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="space-y-2">
            <label htmlFor="font-size" className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Font Size
            </label>
            <Select value={fontSize} onValueChange={setFontSize}>
              <SelectTrigger id="font-size">
                <SelectValue placeholder="Select font size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
                <SelectItem value="x-large">Extra Large</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 h-full pt-8">
            <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
            <Label htmlFor="dark-mode" className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Dark Mode
            </Label>
          </div>
        </div>
      </form>
    </div>
  )
}

