import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md glass">
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
              placeholder="nobody@example.com"
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
              placeholder="••••••••"
              className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-gray-500 focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/20"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="city" className="text-sm font-medium text-gray-300">
              Choose Your City
            </label>
            <select
              id="city"
              className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              <option value="sf">San Francisco</option>
              <option value="nyc">New York City</option>
              <option value="austin">Austin</option>
            </select>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full glass-heavy">Create Account</Button>
          <p className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="text-white hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}