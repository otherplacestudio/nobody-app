"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { personas } from "@/lib/personas"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [city, setCity] = useState<'sf' | 'nyc' | 'austin'>('sf')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Generate random persona for the user
      const cityPersonas = personas[city]
      const randomPersona = cityPersonas[Math.floor(Math.random() * cityPersonas.length)]

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            persona_id: randomPersona.id,
            persona_name: randomPersona.name,
            persona_emoji: randomPersona.emoji,
            persona_bio: randomPersona.bio,
            city,
          },
        },
      })

      if (error) throw error

      toast({
        title: "Welcome to Nobody!",
        description: `You are now ${randomPersona.name} ${randomPersona.emoji}`,
      })

      router.push("/")
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create account",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md glass">
        <form onSubmit={handleSignup}>
          <CardHeader>
            <CardTitle className="text-2xl text-white">Become Nobody</CardTitle>
            <CardDescription className="text-gray-400">
              Create your anonymous profile with an AI-generated persona
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nobody@example.com"
                required
                className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-gray-500 focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-gray-500 focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="city" className="text-sm font-medium text-gray-300">
                Choose Your City
              </label>
              <select
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value as 'sf' | 'nyc' | 'austin')}
                className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                <option value="sf">San Francisco</option>
                <option value="nyc">New York City</option>
                <option value="austin">Austin</option>
              </select>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" disabled={loading} className="w-full glass-heavy">
              {loading ? "Creating account..." : "Create Account"}
            </Button>
            <p className="text-center text-sm text-gray-400">
              Already have an account?{" "}
              <Link href="/login" className="text-white hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}