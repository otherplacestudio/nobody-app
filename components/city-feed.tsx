"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PostCard } from '@/components/post-card'
import { CreatePost } from '@/components/create-post'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { personas } from '@/lib/personas'
import { LogOut, Users } from 'lucide-react'

interface CityFeedProps {
  city: 'sf' | 'nyc' | 'austin'
  cityName: string
  cityDescription: string
}

export function CityFeed({ city, cityName, cityDescription }: CityFeedProps) {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadUserAndPosts()
    
    // Subscribe to new posts
    const channel = supabase
      .channel('posts')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'posts',
        filter: `city=eq.${city}`
      }, (payload) => {
        loadPosts()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [city])

  const loadUserAndPosts = async () => {
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
    
    await loadPosts()
  }

  const loadPosts = async () => {
    setLoading(true)
    
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profile:profiles(*)
      `)
      .eq('city', city)
      .is('parent_id', null)
      .order('created_at', { ascending: false })
      .limit(50)
    
    if (!error && data) {
      setPosts(data)
    }
    
    setLoading(false)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleLike = async (postId: string) => {
    if (!user) return
    
    // Check if already liked
    const { data: existingLike } = await supabase
      .from('likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .single()
    
    if (existingLike) {
      // Unlike
      await supabase
        .from('likes')
        .delete()
        .eq('id', existingLike.id)
    } else {
      // Like
      await supabase
        .from('likes')
        .insert({
          post_id: postId,
          user_id: user.id
        })
    }
    
    loadPosts()
  }

  const cityPersonas = personas[city]

  return (
    <div className="min-h-screen p-4">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white">{cityName}</h1>
              <p className="text-gray-400">{cityDescription}</p>
            </div>
            <Button
              variant="ghost"
              className="glass"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
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

        <div className="grid gap-6 lg:grid-cols-3 mb-6">
          <div className="lg:col-span-2 space-y-4">
            {user && profile && (
              <CreatePost
                city={city}
                userId={user.id}
                onPostCreated={loadPosts}
              />
            )}
            
            {loading ? (
              <Card className="glass">
                <CardContent className="p-8 text-center">
                  <p className="text-gray-400">Loading posts...</p>
                </CardContent>
              </Card>
            ) : posts.length === 0 ? (
              <Card className="glass">
                <CardContent className="p-8 text-center">
                  <p className="text-gray-400">No posts yet. Be the first!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onLike={() => handleLike(post.id)}
                  />
                ))}
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Active Personas
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
          </div>
        </div>
      </div>
    </div>
  )
}