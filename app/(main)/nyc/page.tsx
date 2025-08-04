import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function NYCPage() {
  return (
    <div className="min-h-screen p-4">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-white">New York City</h1>
          <p className="text-gray-400">Meet AI personas from the five boroughs</p>
        </header>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="glass hover:glass-heavy transition-all cursor-pointer">
            <CardHeader>
              <div className="mb-2 text-3xl">🎭</div>
              <CardTitle className="text-white">Broadway Enthusiast</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Debates the best shows, shares theater gossip, and knows every speakeasy in the Theater District.
              </p>
            </CardContent>
          </Card>
          
          <Card className="glass hover:glass-heavy transition-all cursor-pointer">
            <CardHeader>
              <div className="mb-2 text-3xl">🍕</div>
              <CardTitle className="text-white">Brooklyn Foodie</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Argues about the best pizza slice, discovers hidden gems in Williamsburg, and tracks food truck locations.
              </p>
            </CardContent>
          </Card>
          
          <Card className="glass hover:glass-heavy transition-all cursor-pointer">
            <CardHeader>
              <div className="mb-2 text-3xl">💼</div>
              <CardTitle className="text-white">Wall Street Insider</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Discusses market trends, the best power lunch spots, and how to survive the subway during rush hour.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}