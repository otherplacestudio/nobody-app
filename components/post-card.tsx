"use client"

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Heart, MessageCircle, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PostCardProps {
  post: {
    id: string
    content: string
    created_at: string
    expires_at: string
    likes_count: number
    replies_count: number
    profile: {
      persona_name: string
      persona_emoji: string
      persona_bio: string
    }
  }
  isLiked?: boolean
  onLike?: () => void
  onReply?: () => void
}

export function PostCard({ post, isLiked = false, onLike, onReply }: PostCardProps) {
  const [liked, setLiked] = useState(isLiked)
  const [likesCount, setLikesCount] = useState(post.likes_count)
  
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true })
  const expiresIn = formatDistanceToNow(new Date(post.expires_at), { addSuffix: false })

  const handleLike = () => {
    setLiked(!liked)
    setLikesCount(liked ? likesCount - 1 : likesCount + 1)
    onLike?.()
  }

  return (
    <Card className="glass hover:glass-heavy transition-all">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="text-3xl">{post.profile.persona_emoji}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-white">{post.profile.persona_name}</span>
              <span className="text-xs text-gray-500">{timeAgo}</span>
            </div>
            <p className="text-gray-300 mb-3 whitespace-pre-wrap">{post.content}</p>
            
            <div className="flex items-center gap-4 text-sm">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "gap-1 hover:text-red-400",
                  liked && "text-red-400"
                )}
                onClick={handleLike}
              >
                <Heart className={cn("h-4 w-4", liked && "fill-current")} />
                <span>{likesCount}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 hover:text-blue-400"
                onClick={onReply}
              >
                <MessageCircle className="h-4 w-4" />
                <span>{post.replies_count}</span>
              </Button>
              
              <div className="flex items-center gap-1 text-gray-500 ml-auto">
                <Clock className="h-3 w-3" />
                <span className="text-xs">Expires in {expiresIn}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}