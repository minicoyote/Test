"use server"

import axios from "axios"
import * as cheerio from "cheerio"
import robotsParser from "robots-parser"

export async function scrapeUrl(url: string, fontSize: string, darkMode: boolean) {
  try {
    // Validate URL
    const urlObj = new URL(url)

    // Check robots.txt
    try {
      const robotsUrl = `${urlObj.protocol}//${urlObj.hostname}/robots.txt`
      const robotsResponse = await axios.get(robotsUrl, { timeout: 5000 })
      const robots = robotsParser(robotsUrl, robotsResponse.data)

      if (!robots.isAllowed(url, "NewsScraperBot")) {
        return {
          error: "This website does not allow scraping. Please respect their robots.txt policy.",
        }
      }
    } catch (error) {
      // If robots.txt doesn't exist or can't be parsed, we'll proceed with caution
      console.log("Could not check robots.txt, proceeding with caution")
    }

    // Fetch the page
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "NewsScraperBot/1.0 (educational purposes)",
        Accept: "text/html",
      },
      timeout: 10000,
    })

    // Parse the HTML
    const $ = cheerio.load(response.data)

    // Remove unwanted elements
    $("script, style, iframe, nav, footer, .ads, .comments, .sidebar").remove()

    // Extract title
    const title = $("h1").first().text().trim() || $("title").text().trim()

    // Extract main content
    // This is a simplified approach - real news sites have different structures
    let mainContent =
      $("article").html() ||
      $(".article-content").html() ||
      $(".post-content").html() ||
      $(".entry-content").html() ||
      $("main").html()

    // If we couldn't find a specific content container, try to extract the most relevant content
    if (!mainContent) {
      // Look for the div with the most paragraphs
      let maxParagraphs = 0
      let contentDiv = ""

      $("div").each((i, el) => {
        const paragraphCount = $(el).find("p").length
        if (paragraphCount > maxParagraphs) {
          maxParagraphs = paragraphCount
          contentDiv = $(el).html() || ""
        }
      })

      mainContent = contentDiv
    }

    // If we still don't have content, just get the body
    if (!mainContent) {
      mainContent = $("body").html() || ""
    }

    // Create a clean, formatted HTML output
    const formattedHtml = `
      <div class="scraped-content">
        <h1 class="text-2xl font-bold mb-4">${title}</h1>
        <div class="source mb-4">
          <p class="text-sm text-slate-500">
            Source: <a href="${url}" target="_blank" rel="noopener noreferrer" class="text-slate-600 hover:underline">${urlObj.hostname}</a>
          </p>
        </div>
        <div class="content">
          ${mainContent}
        </div>
      </div>
    `

    return { html: formattedHtml }
  } catch (error) {
    console.error("Scraping error:", error)

    if (axios.isAxiosError(error)) {
      if (error.code === "ECONNABORTED") {
        return { error: "Request timed out. The website might be too slow or blocking our request." }
      }
      if (error.response) {
        return { error: `Failed to fetch the page: HTTP ${error.response.status}` }
      }
      if (error.request) {
        return { error: "Could not connect to the website. Please check the URL and try again." }
      }
    }

    return { error: "An error occurred while scraping the content. Please try a different URL." }
  }
}

