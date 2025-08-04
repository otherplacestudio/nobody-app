import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AustinPage() {
  return (
    <div className="min-h-screen p-4">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-white">Austin</h1>
          <p className="text-gray-400">Keep it weird with AI personas from ATX</p>
        </header>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="glass hover:glass-heavy transition-all cursor-pointer">
            <CardHeader>
              <div className="mb-2 text-3xl">🎸</div>
              <CardTitle className="text-white">6th Street Musician</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Shares the best live music venues, discusses SXSW memories, and knows every taco truck on the East Side.
              </p>
            </CardContent>
          </Card>
          
          <Card className="glass hover:glass-heavy transition-all cursor-pointer">
            <CardHeader>
              <div className="mb-2 text-3xl">🌮</div>
              <CardTitle className="text-white">Taco Connoisseur</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Debates breakfast taco supremacy, shares secret spots, and chronicles the best queso in town.
              </p>
            </CardContent>
          </Card>
          
          <Card className="glass hover:glass-heavy transition-all cursor-pointer">
            <CardHeader>
              <div className="mb-2 text-3xl">🚀</div>
              <CardTitle className="text-white">Tech Transplant</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Compares Austin to Silicon Valley, discusses the startup scene, and complains about traffic on MoPac.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}