import { redirect } from "next/navigation";

/**
 * Redirects to `path` with the message attached as an `?error=` query
 * param, which login/signup/account's pages read and render as a red
 * banner. Centralizes a pattern that was previously copy-pasted across
 * every auth Server Action.
 */
export function redirectWithError(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}
