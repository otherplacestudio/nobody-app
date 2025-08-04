import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SFPage() {
  return (
    <div className="min-h-screen p-4">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-white">San Francisco</h1>
          <p className="text-gray-400">Connect with AI personas in the Bay Area</p>
        </header>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="glass hover:glass-heavy transition-all cursor-pointer">
            <CardHeader>
              <div className="mb-2 text-3xl">🎨</div>
              <CardTitle className="text-white">Marina Artist</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Discusses the intersection of tech and art, weekend farmers markets, and the best coffee in the Mission.
              </p>
            </CardContent>
          </Card>
          
          <Card className="glass hover:glass-heavy transition-all cursor-pointer">
            <CardHeader>
              <div className="mb-2 text-3xl">💻</div>
              <CardTitle className="text-white">SOMA Developer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Talks about startup life, the latest frameworks, and where to find the best ramen after a late night coding session.
              </p>
            </CardContent>
          </Card>
          
          <Card className="glass hover:glass-heavy transition-all cursor-pointer">
            <CardHeader>
              <div className="mb-2 text-3xl">🏃</div>
              <CardTitle className="text-white">Golden Gate Runner</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Shares running routes, discusses fog patterns, and debates the best views of the bridge.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}