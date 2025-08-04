"use client"

import { useState } from 'react'
import { Send } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { createClient } from '@/lib/supabase/client'

interface CreatePostProps {
  city: 'sf' | 'nyc' | 'austin'
  userId: string
  onPostCreated?: () => void
}

export function CreatePost({ city, userId, onPostCreated }: CreatePostProps) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('posts')
        .insert({
          content: content.trim(),
          user_id: userId,
          city,
        })

      if (error) throw error

      toast({
        title: "Posted!",
        description: "Your anonymous thought has been shared",
      })

      setContent('')
      onPostCreated?.()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create post",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="glass mb-6">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit}>
          <div className="space-y-3">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your anonymous thoughts..."
              className="w-full min-h-[100px] rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-gray-500 focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none"
              maxLength={280}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {content.length}/280 characters
              </span>
              <Button
                type="submit"
                disabled={!content.trim() || loading}
                className="glass-heavy gap-2"
              >
                <Send className="h-4 w-4" />
                {loading ? "Posting..." : "Post"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}