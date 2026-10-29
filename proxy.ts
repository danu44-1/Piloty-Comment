import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Pemeriksaan awal hanya memastikan cookie sesi tersedia.
// Validasi sesi sebenarnya tetap dilakukan di Server Component atau Server Action.
export function proxy(request: NextRequest) {
  if (!request.cookies.has("sesi")) {
    return NextResponse.redirect(new URL("/masuk", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/comments/:path*", "/rules/:path*", "/video/:path*"],
};
