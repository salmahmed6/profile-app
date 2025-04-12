import { Users } from "lucide-react"
import { UserGrid } from "@/components/user-grid"
import { AddUserButton } from "@/components/add-user-button"
import { AnimatedGradientText } from "@/components/animated-gradient-text"
import { FloatingParticles } from "@/components/floating-particles"
import { fetchUsers } from "@/lib/api-utils"

export default async function UsersPage() {
  // Fetch users from the API with fallback to mock data
  const { users, error, responseText } = await fetchUsers()

  return (
    <main className="container mx-auto px-4 py-10 relative overflow-hidden">
      <FloatingParticles />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4 relative z-10">
        <div>
          <AnimatedGradientText className="text-3xl font-bold tracking-tight mb-2">
            Community Members
          </AnimatedGradientText>
          <p className="text-muted-foreground">Connect with {users.length} amazing people in our community</p>
        </div>
        <AddUserButton />
      </div>

      {error && (
        <div className="mb-8 p-4 border border-red-200 bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-300 rounded-md">
          <h3 className="font-semibold mb-2">API Connection Issue</h3>
          <p className="text-sm">{error}</p>
          <p className="text-sm mt-2">
            Using mock data instead. You can still interact with the app normally.
            <br />
            Current API URL:{" "}
            <code className="bg-red-100 dark:bg-red-900/50 px-1 py-0.5 rounded">
              {process.env.NEXT_PUBLIC_API_URL || "/api"}
            </code>
          </p>
          {responseText && (
            <div className="mt-4">
              <p className="text-sm font-semibold">Response preview:</p>
              <pre className="text-xs bg-red-100 dark:bg-red-900/30 p-2 mt-1 rounded overflow-auto max-h-32">
                {responseText.substring(0, 500)}
                {responseText.length > 500 ? "..." : ""}
              </pre>
            </div>
          )}
        </div>
      )}

      {!error && <UserGrid users={users} />}

      {!error && users.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-6 mb-4">
            <Users className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No users found</h2>
          <p className="text-muted-foreground mb-4 max-w-md">
            There are no users in the system yet. Be the first to join our community!
          </p>
          <AddUserButton />
        </div>
      )}
    </main>
  )
}
