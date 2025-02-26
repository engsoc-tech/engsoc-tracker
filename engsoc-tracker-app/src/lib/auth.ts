

import { Lucia } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { User } from "lucia";
import { Session } from "lucia";
import prisma from "@/db/prisma";
import { RoleType } from "../../prisma/generated/zod";
const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        expires: false,
        attributes: {
            secure: process.env.NODE_ENV === "production",
        },
    },
    getUserAttributes: (attributes) => {
        return {
            id: attributes.UserId,
            role: attributes.role,
            name: attributes.name,
            email: attributes.email,
        };
    },
});

export const validateRequest = async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
> => {
    'use server'
    const { cookies } = await import("next/headers");
    const sessionId = await cookies().get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) {
        return {
            user: null,
            session: null,
        };
    }

    const result = await lucia.validateSession(sessionId);

    // next.js throws when you attempt to set cookie when rendering page
    try {
        if (result.session && result.session.fresh) {
            const sessionCookie = lucia.createSessionCookie(result.session.id);
            cookies().set(
                sessionCookie.name,
                sessionCookie.value,
                sessionCookie.attributes
            );
        }
        if (!result.session) {
            const sessionCookie = lucia.createBlankSessionCookie();
            cookies().set(
                sessionCookie.name,
                sessionCookie.value,
                sessionCookie.attributes
            );
        }
    } catch { }
    return result;
};

declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: DatabaseUserAttributes;
        // UserId: String; UNCOMMENT THIS IF IT DOESNT WORK
    }
}
interface DatabaseUserAttributes {
    UserId: string;
    role: RoleType;
    name: string;
    email: string;
    lastSignedIn: Date;
    createdAt: Date;
}