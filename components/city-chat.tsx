"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChatList } from '@/components/chat/chat-list'
import { ChatRoom } from '@/components/chat/chat-room'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { personas } from '@/lib/personas'
import { LogOut, Users, ArrowLeft } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface CityChatProps {
  city: 'sf' | 'nyc' | 'austin'
  cityName: string
  cityDescription: string
}

export function CityChat({ city, cityName, cityDescription }: CityChatProps) {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    loadUser()
    updateUserStatus('online')

    return () => {
      updateUserStatus('offline')
    }
  }, [])

  const loadUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/login')
      return
    }
    
    setUser(user)
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    setProfile(profile)
    setLoading(false)
  }

  const updateUserStatus = async (status: 'online' | 'away' | 'offline') => {
    if (!user) return
    
    await supabase
      .from('user_status')
      .upsert({
        user_id: user.id,
        status,
        last_seen: new Date().toISOString()
      })
  }

  const handleSignOut = async () => {
    await updateUserStatus('offline')
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleFindMatch = async () => {
    try {
      const { data, error } = await supabase
        .rpc('find_or_create_chat_match', { user_city: city })
      
      if (error) throw error
      
      if (data) {
        setSelectedRoomId(data)
        toast({
          title: "Match found!",
          description: "Connecting you to an anonymous chat...",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to find a match. Try again!",
        variant: "destructive"
      })
    }
  }

  const handleCreateRoom = async () => {
    const roomName = prompt('Enter room name:')
    if (!roomName) return

    try {
      const { data, error } = await supabase
        .from('chat_rooms')
        .insert({
          name: roomName,
          city,
          type: 'public',
          created_by: user.id
        })
        .select()
        .single()
      
      if (error) throw error
      
      // Join the room
      await supabase
        .from('chat_participants')
        .insert({
          room_id: data.id,
          user_id: user.id
        })
      
      setSelectedRoomId(data.id)
      
      toast({
        title: "Room created!",
        description: `Created "${roomName}" chat room`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create room",
        variant: "destructive"
      })
    }
  }

  const cityPersonas = personas[city]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    )
  }

  // Show chat room if selected
  if (selectedRoomId) {
    return (
      <ChatRoom
        roomId={selectedRoomId}
        userId={user.id}
        userProfile={profile}
        onBack={() => setSelectedRoomId(null)}
      />
    )
  }

  // Show chat list
  return (
    <div className="min-h-screen p-4">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white">{cityName}</h1>
              <p className="text-gray-400">{cityDescription}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                className="glass"
                onClick={() => router.push('/')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Cities
              </Button>
              <Button
                variant="ghost"
                className="glass"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
          
          {profile && (
            <Card className="glass mb-6">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{profile.persona_emoji}</span>
                  <div>
                    <p className="font-semibold text-white">{profile.persona_name}</p>
                    <p className="text-sm text-gray-400">{profile.persona_bio}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </header>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-white mb-4">Active Chats</h2>
            <ChatList
              city={city}
              userId={user.id}
              onSelectRoom={setSelectedRoomId}
              onCreateRoom={handleCreateRoom}
              onFindMatch={handleFindMatch}
            />
          </div>
          
          <div className="space-y-4">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  City Personas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {cityPersonas.map((persona) => (
                  <div key={persona.id} className="flex items-start gap-2">
                    <span className="text-2xl">{persona.emoji}</span>
                    <div>
                      <p className="text-sm font-semibold text-white">{persona.name}</p>
                      <p className="text-xs text-gray-400 line-clamp-2">{persona.bio}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-white">Chat Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-400">
                <p>• Messages expire in 24 hours</p>
                <p>• Complete anonymity</p>
                <p>• AI-enhanced personas</p>
                <p>• Real-time messaging</p>
                <p>• Random matching available</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}