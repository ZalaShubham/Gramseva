import { cookies } from "next/headers";
import crypto from "crypto";
import { prisma } from "./prisma"; // Prisma client instance

/** Types and Errors */
export type Role = "USER" | "POLITICIAN" | "EMPLOYER" | "MODERATOR" | "ADMIN";

export interface CurrentUser {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: Role;
  level: number; // 0, 1, 2
  community: "SC" | "ST" | null;
  subCaste: string | null;
  state: string | null;
  district: string | null;
  isPhoneVerified: boolean;
  verifiedAt: Date | null;
}

export class AuthError extends Error {
  code: "UNAUTHENTICATED" | "INSUFFICIENT_LEVEL" | "INSUFFICIENT_ROLE";
  status: number;

  constructor(
    code: "UNAUTHENTICATED" | "INSUFFICIENT_LEVEL" | "INSUFFICIENT_ROLE",
    message: string,
    status = 403
  ) {
    super(message);
    this.code = code;
    this.status = status;
    this.name = "AuthError";
  }
}

/** Session handling */
export const SESSION_COOKIE_NAME = "gramseva_session";
const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "strict" as const,
  path: "/",
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 24 * 30, // 30 days
};

/** Helper to hash a session token */
function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/** Create a new session for a user and set the cookie */
export async function createSession(
  userId: string,
  deviceInfo?: string,
  ipAddress?: string
): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  await prisma.session.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
      deviceInfo: deviceInfo ?? null,
      ipAddress: ipAddress ?? null,
    },
  });

  // Set cookie using Next.js cookies API
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, SESSION_COOKIE_OPTIONS);
  return token;
}

/** Destroy all sessions for a user (logout everywhere) */
export async function logoutAll(userId: string): Promise<void> {
  await prisma.session.deleteMany({ where: { userId } });
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/** Retrieve the current user based on the session cookie */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    const tokenHash = hashToken(token);
    const session = await prisma.session.findUnique({
      where: { tokenHash },
      include: { user: true },
    });
    if (!session || session.expiresAt < new Date()) return null;

    const u = session.user;
    return {
      id: u.id,
      name: u.name,
      email: u.email ?? null,
      phone: u.phone ?? null,
      role: u.role as Role,
      level: u.level,
      community: u.community ?? null,
      subCaste: u.subCaste ?? null,
      state: u.state ?? null,
      district: u.district ?? null,
      isPhoneVerified: u.isPhoneVerified,
      verifiedAt: u.verifiedAt ? new Date(u.verifiedAt) : null,
    };
  } catch {
    return null;
  }
}

/** Permission helper: requireLevel */
export async function requireLevel(requiredLevel: number): Promise<CurrentUser> {
  const user = await getCurrentUser();
  const currentLevel = user ? user.level : 0;

  if (requiredLevel > 0 && !user) {
    throw new AuthError("UNAUTHENTICATED", `Authentication required. Level ${requiredLevel} requires signing in.`, 401);
  }

  if (currentLevel < requiredLevel) {
    throw new AuthError(
      "INSUFFICIENT_LEVEL",
      `Access denied. Requires Level ${requiredLevel} clearance. Current level is ${currentLevel}.`,
      403
    );
  }

  // If level 0 is required and user is not logged in, return a simulated guest
  if (!user) {
    return {
      id: "guest-visitor",
      name: "Guest Visitor",
      email: null,
      phone: null,
      role: "USER",
      level: 0,
      community: null,
      subCaste: null,
      state: null,
      district: null,
      isPhoneVerified: false,
      verifiedAt: null,
    };
  }
  return user;
}

/** Permission helper: requireRole */
export async function requireRole(requiredRole: Role | Role[]): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new AuthError("UNAUTHENTICATED", "Authentication required to access this resource.", 401);
  }
  const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  if (!allowedRoles.includes(user.role)) {
    throw new AuthError(
      "INSUFFICIENT_ROLE",
      `Forbidden: Requires role [${allowedRoles.join(", ")}]. Current role is '${user.role}'.`,
      403
    );
  }
  return user;
}
