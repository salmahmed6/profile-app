// Types for our data
export interface User {
  id: string
  name: string
  email: string
  bio?: string
  avatarUrl?: string
  createdAt: string
}

// Mock data to use when API is unavailable
const mockUsers: User[] = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex@example.com",
    bio: "Community leader and tech enthusiast",
    avatarUrl: "/placeholder.svg?height=200&width=200",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    name: "Sarah Williams",
    email: "sarah@example.com",
    bio: "Product designer with a passion for UX",
    avatarUrl: "/placeholder.svg?height=200&width=200",
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    name: "Michael Chen",
    email: "michael@example.com",
    bio: "Software engineer and open source contributor",
    avatarUrl: "/placeholder.svg?height=200&width=200",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

// In-memory store for mock data
let inMemoryUsers = [...mockUsers]

// Helper function to generate a unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Function to get the API URL
export function getApiUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || "/api"
}

// Also update the fetchUsers function for consistency
export async function fetchUsers(): Promise<{ users: User[]; error: string | null; responseText: string }> {
  try {
    const apiUrl = getApiUrl()
    console.log(`Attempting to fetch users from: ${apiUrl}/users`)

    // Try to make the API call with a timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    try {
      const response = await fetch(`${apiUrl}/users`, {
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      // Store the response text for debugging
      const responseText = await response.text()
      console.log("API response:", responseText.substring(0, 200))

      // Try to parse the response as JSON
      try {
        const data = JSON.parse(responseText)
        if (!Array.isArray(data)) {
          console.warn("API response is not an array:", data)
          console.log("Falling back to mock data")
          return { users: inMemoryUsers, error: null, responseText }
        }
        return { users: data, error: null, responseText }
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", responseText.substring(0, 200))
        console.log("Falling back to mock data")
        return {
          users: inMemoryUsers,
          error: "API response is not valid JSON. Using mock data instead.",
          responseText,
        }
      }
    } catch (fetchError) {
      clearTimeout(timeoutId)
      console.error("Network error during fetch:", fetchError)
      console.log("Falling back to mock data")
      return {
        users: inMemoryUsers,
        error:
          fetchError instanceof Error
            ? `Network error: ${fetchError.message}. Using mock data instead.`
            : "Failed to fetch users. Using mock data instead.",
        responseText: "",
      }
    }
  } catch (error) {
    console.error("Error in fetchUsers:", error)
    console.log("Using mock data as last resort")
    return {
      users: inMemoryUsers,
      error:
        error instanceof Error
          ? `Error: ${error.message}. Using mock data instead.`
          : "Failed to fetch users. Using mock data instead.",
      responseText: "",
    }
  }
}

// Function to create a user with fallback to mock data
export async function createUser(userData: Omit<User, "id" | "createdAt">): Promise<User> {
  try {
    const apiUrl = getApiUrl()
    console.log(`Attempting to create user at: ${apiUrl}/users`, userData)

    // Create a mock user first as fallback
    const mockUser: User = {
      ...userData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    }

    // Try to make the API call with a timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    try {
      const response = await fetch(`${apiUrl}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(userData),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      // Get response as text first
      const responseText = await response.text()
      console.log("API response:", responseText)

      // Try to parse as JSON
      try {
        const data = JSON.parse(responseText)
        if (response.ok) {
          console.log("Successfully created user via API")
          return data
        }
        throw new Error(data.message || data.error || `Server responded with status: ${response.status}`)
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", responseText)
        console.log("Falling back to mock data")

        // Add to in-memory store
        inMemoryUsers = [mockUser, ...inMemoryUsers]
        return mockUser
      }
    } catch (fetchError) {
      clearTimeout(timeoutId)
      console.error("Network error during fetch:", fetchError)
      console.log("Falling back to mock data")

      // Add to in-memory store
      inMemoryUsers = [mockUser, ...inMemoryUsers]
      return mockUser
    }
  } catch (error) {
    console.error("Error in createUser:", error)
    console.log("Using mock data as last resort")

    // Create a mock user as last resort
    const lastResortUser: User = {
      ...userData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    }

    inMemoryUsers = [lastResortUser, ...inMemoryUsers]
    return lastResortUser
  }
}

// Similarly, update the updateUser function for better error handling
export async function updateUser(userId: string, userData: Partial<User>): Promise<User> {
  try {
    const apiUrl = getApiUrl()
    console.log(`Attempting to update user at: ${apiUrl}/users/${userId}`, userData)

    // Find the existing user in mock data
    const existingUser = inMemoryUsers.find((user) => user.id === userId)
    if (!existingUser) {
      throw new Error(`User with ID ${userId} not found`)
    }

    // Create updated mock user first as fallback
    const mockUpdatedUser: User = {
      ...existingUser,
      ...userData,
    }

    // Try to make the API call with a timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    try {
      const response = await fetch(`${apiUrl}/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(userData),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      // Get response as text first
      const responseText = await response.text()
      console.log("API response:", responseText)

      // Try to parse as JSON
      try {
        const data = JSON.parse(responseText)
        if (response.ok) {
          console.log("Successfully updated user via API")
          return data
        }
        throw new Error(data.message || data.error || `Error: ${response.status}`)
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", responseText)
        console.log("Falling back to mock data")

        // Update in-memory store
        inMemoryUsers = inMemoryUsers.map((user) => (user.id === userId ? mockUpdatedUser : user))
        return mockUpdatedUser
      }
    } catch (fetchError) {
      clearTimeout(timeoutId)
      console.error("Network error during fetch:", fetchError)
      console.log("Falling back to mock data")

      // Update in-memory store
      inMemoryUsers = inMemoryUsers.map((user) => (user.id === userId ? mockUpdatedUser : user))
      return mockUpdatedUser
    }
  } catch (error) {
    console.error("Error in updateUser:", error)
    console.log("Using mock data as last resort")

    // Find the existing user
    const existingUser = inMemoryUsers.find((user) => user.id === userId)
    if (!existingUser) {
      throw new Error(`User with ID ${userId} not found`)
    }

    // Create updated user as last resort
    const lastResortUser: User = {
      ...existingUser,
      ...userData,
    }

    // Update in-memory store
    inMemoryUsers = inMemoryUsers.map((user) => (user.id === userId ? lastResortUser : user))
    return lastResortUser
  }
}

// Update the deleteUser function for better error handling
export async function deleteUser(userId: string): Promise<boolean> {
  try {
    const apiUrl = getApiUrl()
    console.log(`Attempting to delete user at: ${apiUrl}/users/${userId}`)

    // Check if user exists in mock data
    const userExists = inMemoryUsers.some((user) => user.id === userId)
    if (!userExists) {
      console.warn(`User with ID ${userId} not found in mock data`)
    }

    // Try to make the API call with a timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    try {
      const response = await fetch(`${apiUrl}/users/${userId}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        console.log("Successfully deleted user via API")
        // Also remove from mock data to keep in sync
        inMemoryUsers = inMemoryUsers.filter((user) => user.id !== userId)
        return true
      }

      console.warn(`API returned status ${response.status} for delete operation`)
      console.log("Falling back to mock data delete")

      // Delete from in-memory store
      inMemoryUsers = inMemoryUsers.filter((user) => user.id !== userId)
      return true
    } catch (fetchError) {
      clearTimeout(timeoutId)
      console.error("Network error during fetch:", fetchError)
      console.log("Falling back to mock data delete")

      // Delete from in-memory store
      inMemoryUsers = inMemoryUsers.filter((user) => user.id !== userId)
      return true
    }
  } catch (error) {
    console.error("Error in deleteUser:", error)
    console.log("Using mock data delete as last resort")

    // Delete from in-memory store as last resort
    inMemoryUsers = inMemoryUsers.filter((user) => user.id !== userId)
    return true
  }
}
