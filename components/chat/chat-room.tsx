"use client"

import { useEffect, useState, useRef } from 'react'
import { Send, ArrowLeft, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MessageBubble } from './message-bubble'
import { TypingIndicator } from './typing-indicator'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/use-toast'

interface ChatRoomProps {
  roomId: string
  userId: string
  userProfile: any
  onBack?: () => void
}

export function ChatRoom({ roomId, userId, userProfile, onBack }: ChatRoomProps) {
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const [roomInfo, setRoomInfo] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    loadRoomInfo()
    loadMessages()
    subscribeToMessages()
    subscribeToTyping()
    markAsRead()

    return () => {
      // Clean up subscriptions
      supabase.channel(`room:${roomId}`).unsubscribe()
      supabase.channel(`typing:${roomId}`).unsubscribe()
    }
  }, [roomId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadRoomInfo = async () => {
    const { data } = await supabase
      .from('chat_rooms')
      .select('*, participants:chat_participants(count)')
      .eq('id', roomId)
      .single()
    
    setRoomInfo(data)
  }

  const loadMessages = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:profiles(*)
      `)
      .eq('room_id', roomId)
      .order('created_at', { ascending: true })
      .limit(100)

    if (!error && data) {
      setMessages(data)
    }
    setLoading(false)
  }

  const subscribeToMessages = () => {
    const channel = supabase
      .channel(`room:${roomId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `room_id=eq.${roomId}`
      }, async (payload) => {
        // Fetch the complete message with sender info
        const { data } = await supabase
          .from('messages')
          .select(`
            *,
            sender:profiles(*)
          `)
          .eq('id', payload.new.id)
          .single()
        
        if (data) {
          setMessages(prev => [...prev, data])
          markAsRead()
        }
      })
      .subscribe()
  }

  const subscribeToTyping = () => {
    const channel = supabase
      .channel(`typing:${roomId}`)
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        const typing = Object.values(state).flat()
          .filter((user: any) => user.is_typing && user.user_id !== userId)
          .map((user: any) => user.persona_name)
        setTypingUsers(typing)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: userId,
            persona_name: userProfile.persona_name,
            is_typing: false
          })
        }
      })
  }

  const markAsRead = async () => {
    await supabase
      .from('chat_participants')
      .update({ last_read_at: new Date().toISOString() })
      .eq('room_id', roomId)
      .eq('user_id', userId)
  }

  const handleTyping = async (typing: boolean) => {
    const channel = supabase.channel(`typing:${roomId}`)
    await channel.track({
      user_id: userId,
      persona_name: userProfile.persona_name,
      is_typing: typing
    })
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    setSending(true)
    handleTyping(false)

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          room_id: roomId,
          sender_id: userId,
          content: newMessage.trim()
        })

      if (error) throw error

      setNewMessage('')
      inputRef.current?.focus()
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex flex-col h-screen max-h-screen bg-black">
      {/* Header */}
      <div className="glass border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="hover:bg-white/10"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <div>
              <h2 className="font-semibold text-white">
                {roomInfo?.name || 'Anonymous Chat'}
              </h2>
              {roomInfo?.participant_count && (
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Users className="h-3 w-3" />
                  <span>{roomInfo.participant_count} participants</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.sender_id === userId}
              />
            ))}
          </>
        )}
        
        {typingUsers.length > 0 && (
          <TypingIndicator users={typingUsers} />
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="glass border-t border-white/10 p-4">
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value)
              handleTyping(e.target.value.length > 0)
            }}
            onBlur={() => handleTyping(false)}
            placeholder="Type a message..."
            className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-gray-500 focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/20"
            maxLength={500}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!newMessage.trim() || sending}
            className="rounded-full glass-heavy h-10 w-10"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}