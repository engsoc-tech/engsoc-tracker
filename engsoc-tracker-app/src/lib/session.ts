"use server"
import { lucia } from "@/lib/auth";
import { validateRequest } from "@/lib/auth";
import { AuthenticationError } from "./errors";
export const getCurrentUser = async () => {
    const session = await validateRequest();
    if (!session.user) {
        return undefined;
    }
    return session.user;
};

export const assertAuthenticated = async () => {
    const user = await getCurrentUser();
    if (!user) {
        throw new AuthenticationError();
    }
    return user;
};

export async function setSession(userId: string | null) {
    const { cookies } = await import("next/headers");
    if (userId === null) {
        // Clear the session cookie
        cookies().delete(lucia.sessionCookieName);
    } else {
        const session = await lucia.createSession(userId, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        cookies().set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes
        );
    }
}
