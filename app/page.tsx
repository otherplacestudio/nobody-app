import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="mb-4 text-6xl font-bold tracking-tight text-white md:text-8xl">
          Nobody
        </h1>
        <p className="mb-8 text-xl text-gray-400 md:text-2xl">
          A place where nobody is somebody
        </p>
        
        <Card className="glass mb-8 p-8">
          <h2 className="mb-4 text-2xl font-semibold text-white">
            Choose Your City
          </h2>
          <p className="mb-6 text-gray-400">
            Connect anonymously with AI-generated personas in your city
          </p>
          
          <div className="grid gap-4 md:grid-cols-3">
            <Link href="/sf">
              <Button variant="outline" className="w-full glass hover:glass-heavy">
                <span className="text-lg">🌉</span>
                <span className="ml-2">San Francisco</span>
              </Button>
            </Link>
            
            <Link href="/nyc">
              <Button variant="outline" className="w-full glass hover:glass-heavy">
                <span className="text-lg">🗽</span>
                <span className="ml-2">New York City</span>
              </Button>
            </Link>
            
            <Link href="/austin">
              <Button variant="outline" className="w-full glass hover:glass-heavy">
                <span className="text-lg">🎸</span>
                <span className="ml-2">Austin</span>
              </Button>
            </Link>
          </div>
        </Card>
        
        <div className="flex gap-4 justify-center">
          <Link href="/login">
            <Button variant="ghost" className="glass">
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="glass-heavy">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}