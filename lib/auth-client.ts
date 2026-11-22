import { inferAdditionalFields, jwtClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [
    jwtClient(),
    // Tells the client about your extra `role` field on the user.
    // (Matches `user.additionalFields.role` in your server's betterAuth config.)
    inferAdditionalFields({
      user: {
        role: { type: "string" },
        phone: { type: "string" },
        area: { type: "string" },
        bio: { type: "string" },
      },
    }),
  ],
})

export const { useSession, signIn, signUp, signOut } = authClient
