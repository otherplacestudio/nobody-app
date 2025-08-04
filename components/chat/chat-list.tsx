"use client"

import { useState, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { MessageCircle, Users, Plus, Shuffle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

interface ChatListProps {
  city: 'sf' | 'nyc' | 'austin'
  userId: string
  onSelectRoom: (roomId: string) => void
  onCreateRoom?: () => void
  onFindMatch?: () => void
}

export function ChatList({ city, userId, onSelectRoom, onCreateRoom, onFindMatch }: ChatListProps) {
  const [rooms, setRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadRooms()
    subscribeToRooms()
  }, [city])

  const loadRooms = async () => {
    setLoading(true)
    
    // Get public rooms for the city and private rooms user is part of
    const { data, error } = await supabase
      .from('chat_rooms')
      .select(`
        *,
        participants:chat_participants(count),
        last_message:messages(
          content,
          created_at,
          sender:profiles(persona_name, persona_emoji)
        )
      `)
      .or(`city.eq.${city},and(type.eq.private,id.in.(select room_id from chat_participants where user_id='${userId}'))`)
      .order('last_message_at', { ascending: false })
      .limit(20)

    if (!error && data) {
      setRooms(data)
    }
    setLoading(false)
  }

  const subscribeToRooms = () => {
    const channel = supabase
      .channel(`city:${city}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'chat_rooms',
        filter: `city=eq.${city}`
      }, () => {
        loadRooms()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const getRoomDisplayName = (room: any) => {
    if (room.name) return room.name
    if (room.type === 'private') return 'Anonymous Chat'
    return 'Chat Room'
  }

  const getRoomIcon = (room: any) => {
    if (room.type === 'public') return '🏙️'
    if (room.type === 'private') return '👤'
    return '💬'
  }

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={onFindMatch}
          className="glass hover:glass-heavy gap-2"
        >
          <Shuffle className="h-4 w-4" />
          Find Random Chat
        </Button>
        <Button
          onClick={onCreateRoom}
          variant="outline"
          className="glass hover:glass-heavy gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Room
        </Button>
      </div>

      {/* Room List */}
      {loading ? (
        <Card className="glass p-8 text-center">
          <p className="text-gray-400">Loading chats...</p>
        </Card>
      ) : rooms.length === 0 ? (
        <Card className="glass p-8 text-center">
          <p className="text-gray-400 mb-4">No active chats yet</p>
          <Button onClick={onFindMatch} className="glass-heavy">
            Start Your First Chat
          </Button>
        </Card>
      ) : (
        <div className="space-y-2">
          {rooms.map((room) => (
            <Card
              key={room.id}
              className="glass hover:glass-heavy transition-all cursor-pointer"
              onClick={() => onSelectRoom(room.id)}
            >
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{getRoomIcon(room)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-white truncate">
                        {getRoomDisplayName(room)}
                      </h3>
                      {room.last_message?.[0] && (
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(room.last_message[0].created_at), { 
                            addSuffix: true 
                          })}
                        </span>
                      )}
                    </div>
                    
                    {room.last_message?.[0] ? (
                      <p className="text-sm text-gray-400 truncate">
                        <span className="mr-1">{room.last_message[0].sender.persona_emoji}</span>
                        {room.last_message[0].content}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No messages yet</p>
                    )}
                    
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Users className="h-3 w-3" />
                        <span>{room.participants?.[0]?.count || 0}</span>
                      </div>
                      {room.type === 'public' && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300">
                          Public
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}