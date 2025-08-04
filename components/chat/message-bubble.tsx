"use client"

import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'

interface MessageBubbleProps {
  message: {
    id: string
    content: string
    created_at: string
    sender_id: string
    sender: {
      persona_name: string
      persona_emoji: string
    }
  }
  isOwn: boolean
  showAvatar?: boolean
}

export function MessageBubble({ message, isOwn, showAvatar = true }: MessageBubbleProps) {
  const timeAgo = formatDistanceToNow(new Date(message.created_at), { addSuffix: true })

  return (
    <div className={cn("flex gap-2 mb-4", isOwn ? "justify-end" : "justify-start")}>
      {!isOwn && showAvatar && (
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-xl">
          {message.sender.persona_emoji}
        </div>
      )}
      
      <div className={cn("max-w-[70%] group")}>
        {!isOwn && showAvatar && (
          <div className="text-xs text-gray-500 mb-1">{message.sender.persona_name}</div>
        )}
        
        <div
          className={cn(
            "rounded-2xl px-4 py-2 break-words",
            isOwn 
              ? "bg-blue-600/20 backdrop-blur-xl border border-blue-500/30 text-white ml-auto" 
              : "glass text-white"
          )}
        >
          <p className="text-sm">{message.content}</p>
        </div>
        
        <div className={cn(
          "text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity",
          isOwn && "text-right"
        )}>
          {timeAgo}
        </div>
      </div>
      
      {isOwn && showAvatar && (
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-xl">
          {message.sender.persona_emoji}
        </div>
      )}
    </div>
  )
}