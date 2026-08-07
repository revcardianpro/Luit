import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Named "proxy" rather than "middleware" per Next.js 16's renamed file
// convention (see AGENTS.md at the repo root — this is one of the
// breaking changes it warned about). Functionally identical to what
// used to be called Middleware.
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Run on every request except static assets/images — those don't
  // carry session state and refreshing on them would be wasted work.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
