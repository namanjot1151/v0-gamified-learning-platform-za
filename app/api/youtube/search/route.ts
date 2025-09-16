import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
  }

  const API_KEY = process.env.YOUTUBE_API_KEY // Server-side only, not exposed to client

  if (!API_KEY) {
    // Return mock data when no API key is configured
    return NextResponse.json({
      items: getMockVideosForQuery(query),
    })
  }

  try {
    // Search for videos
    const searchResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?` +
        `part=snippet&maxResults=12&q=${encodeURIComponent(query + " educational tutorial")}&` +
        `type=video&videoDuration=medium&videoDefinition=high&` +
        `relevanceLanguage=en&safeSearch=strict&key=${API_KEY}`,
    )

    if (!searchResponse.ok) {
      throw new Error("Failed to fetch from YouTube API")
    }

    const searchData = await searchResponse.json()

    // Get additional video details (duration, view count, etc.)
    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(",")
    const detailsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?` + `part=contentDetails,statistics&id=${videoIds}&key=${API_KEY}`,
    )

    const detailsData = await detailsResponse.json()

    const videos = searchData.items.map((item: any, index: number) => {
      const details = detailsData.items[index]
      return {
        id: item.id.videoId,
        videoId: item.id.videoId,
        title: item.snippet.title,
        channel: item.snippet.channelTitle,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.medium.url,
        publishedAt: item.snippet.publishedAt,
        duration: formatDuration(details?.contentDetails?.duration || "PT0S"),
        views: formatViews(details?.statistics?.viewCount || "0"),
      }
    })

    return NextResponse.json({ items: videos })
  } catch (error) {
    console.error("YouTube API error:", error)
    // Return mock data on error
    return NextResponse.json({
      items: getMockVideosForQuery(query),
    })
  }
}

function formatDuration(duration: string): string {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
  if (!match) return "0:00"

  const hours = Number.parseInt(match[1]?.replace("H", "") || "0")
  const minutes = Number.parseInt(match[2]?.replace("M", "") || "0")
  const seconds = Number.parseInt(match[3]?.replace("S", "") || "0")

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

function formatViews(viewCount: string): string {
  const count = Number.parseInt(viewCount)
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  }
  return count.toString()
}

function getMockVideosForQuery(query: string) {
  return [
    {
      id: "dQw4w9WgXcQ",
      videoId: "dQw4w9WgXcQ",
      title: `${query} - Complete Tutorial for Students`,
      channel: "EduTech Academy",
      duration: "12:45",
      views: "2.1M",
      thumbnail: "/placeholder.svg?height=180&width=320&text=Educational+Video",
      description: `Learn everything about ${query} in this comprehensive tutorial designed for students. Includes examples, practice problems, and real-world applications.`,
      publishedAt: "2024-01-15T10:00:00Z",
    },
    {
      id: "abc123def456",
      videoId: "abc123def456",
      title: `${query} Explained Simply - Visual Learning`,
      channel: "Visual Learning Hub",
      duration: "8:30",
      views: "1.8M",
      thumbnail: "/placeholder.svg?height=180&width=320&text=Visual+Learning",
      description: `Master ${query} with visual explanations and step-by-step breakdowns. Perfect for visual learners and students of all levels.`,
      publishedAt: "2024-02-01T14:30:00Z",
    },
    {
      id: "xyz789ghi012",
      videoId: "xyz789ghi012",
      title: `Advanced ${query} Concepts Made Easy`,
      channel: "Science & Math Masters",
      duration: "15:20",
      views: "956K",
      thumbnail: "/placeholder.svg?height=180&width=320&text=Advanced+Concepts",
      description: `Take your understanding of ${query} to the next level with advanced concepts explained in simple terms.`,
      publishedAt: "2024-01-28T09:15:00Z",
    },
  ]
}
