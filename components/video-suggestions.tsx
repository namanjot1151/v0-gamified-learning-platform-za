"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Search, Play, Eye, BookOpen, Sparkles, Loader2, ExternalLink } from "lucide-react"

interface YouTubeVideo {
  id: string
  title: string
  channel: string
  duration: string
  views: string
  thumbnail: string
  description: string
  videoId: string
  publishedAt: string
}

export default function VideoSuggestions() {
  const [searchTopic, setSearchTopic] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [videos, setVideos] = useState<YouTubeVideo[]>([])
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null)
  const [summary, setSummary] = useState("")
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)
  const [error, setError] = useState("")

  const searchYouTubeVideos = async (query: string): Promise<YouTubeVideo[]> => {
    try {
      const response = await fetch(`/api/youtube/search?q=${encodeURIComponent(query)}`)

      if (!response.ok) {
        throw new Error("Failed to fetch videos")
      }

      const data = await response.json()
      return data.items || []
    } catch (error) {
      console.error("Search error:", error)
      throw error
    }
  }

  const handleSearch = async () => {
    if (!searchTopic.trim()) return

    setIsLoading(true)
    setError("")

    try {
      const searchResults = await searchYouTubeVideos(searchTopic)
      setVideos(searchResults)
    } catch (err) {
      setError("Failed to search videos. Please try again.")
      console.error("Search error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const generateSummary = async (video: YouTubeVideo) => {
    setSelectedVideo(video)
    setIsGeneratingSummary(true)
    setSummary("")

    try {
      const response = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoTitle: video.title,
          videoDescription: video.description,
          videoDuration: video.duration,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate summary")
      }

      const data = await response.json()
      setSummary(data.summary)
    } catch (error) {
      console.error("Summary generation error:", error)
      setSummary(`**Error generating AI summary**

We encountered an issue generating the AI summary for this video. However, here's what we can tell you:

**Video**: ${video.title}
**Channel**: ${video.channel}
**Duration**: ${video.duration}

**Manual Summary**:
This educational video covers important concepts that can help enhance your learning. We recommend watching the video and then using our interactive games to reinforce the concepts presented.

**Study Suggestions**:
1. Watch the video with focus and take notes
2. Try our related educational games
3. Review the material multiple times
4. Apply the concepts through practice exercises`)
    } finally {
      setIsGeneratingSummary(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">AI-Powered Video Learning</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Search YouTube for educational videos on any topic and get AI-generated summaries to help you learn more
          effectively.
        </p>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Search Learning Videos</span>
          </CardTitle>
          <CardDescription>Enter a topic, subject, or specific concept you want to learn about</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Input
              placeholder="e.g., photosynthesis, algebra, world war 2, fractions..."
              value={searchTopic}
              onChange={(e) => setSearchTopic(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Search Videos
                </>
              )}
            </Button>
          </div>
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </CardContent>
      </Card>

      {/* Video Results */}
      {videos.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            {searchTopic ? `Videos about "${searchTopic}"` : "Recommended Videos"}
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <Card key={video.id} className="hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                    {video.duration}
                  </div>
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg line-clamp-2">{video.title}</CardTitle>
                  <CardDescription>{video.channel}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{video.views} views</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-3">{video.description}</p>
                  </div>

                  <div className="space-y-2">
                    <Button
                      className="w-full bg-transparent"
                      variant="outline"
                      onClick={() => window.open(`https://www.youtube.com/watch?v=${video.videoId}`, "_blank")}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Watch on YouTube
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                    <Button onClick={() => generateSummary(video)} className="w-full" variant="secondary">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Get AI Summary
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* AI Summary Section */}
      {selectedVideo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <span>AI-Generated Summary</span>
            </CardTitle>
            <CardDescription>Smart summary for: {selectedVideo.title}</CardDescription>
          </CardHeader>
          <CardContent>
            {isGeneratingSummary ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
                  <p className="text-gray-600">Generating AI summary...</p>
                </div>
              </div>
            ) : summary ? (
              <div className="prose max-w-none">
                <Textarea value={summary} readOnly className="min-h-[300px] font-mono text-sm" />
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 text-blue-800 mb-2">
                    <BookOpen className="h-5 w-5" />
                    <span className="font-semibold">Study Tip</span>
                  </div>
                  <p className="text-blue-700 text-sm">
                    After reading this summary, watch the video and then try our related games to reinforce your
                    learning!
                  </p>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
