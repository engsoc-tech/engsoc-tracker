"use server"

import { z } from "zod"
import { action } from "@/lib/safe-action"
import { setSession } from "@/lib/session"
import prisma from "@/db/prisma"
import { getCurrentUser } from "@/lib/session"
import { AuthenticationError, EmailInUseError, LoginError } from "@/lib/errors"
import { redirect } from "next/navigation"
import crypto from "crypto";
import { revalidatePath } from "next/cache"
const ITERATIONS = 10000;
const MAGIC_LINK_TOKEN_TTL = 1000 * 60 * 5; // 5 min

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
})
async function hashPassword(plainTextPassword: string, salt: string) {
    return new Promise<string>((resolve, reject) => {
        crypto.pbkdf2(
            plainTextPassword,
            salt,
            ITERATIONS,
            64,
            "sha512",
            (err, derivedKey) => {
                if (err) reject(err);
                resolve(derivedKey.toString("hex"));
            }
        );
    });
}
export const login = action
    .schema(loginSchema)
    .action(async ({ parsedInput: { email, password } }) => {
        console.log("Logging in with email:", email)
        try {
            const existingUser = await prisma.user.findUnique({
                where: { email },
                include: { HasAccount: true }
            })

            if (!existingUser?.HasAccount?.password) {
                return { failure: "Invalid email or password" }
            }

            await setSession(existingUser.id)

            return { success: "Successfully logged in", userId: existingUser.id }
        } catch (error) {
            if (error instanceof LoginError) {
                return { failure: "Invalid email or password" }
            }
            console.error("Login error:", error)
            return { failure: "An unexpected error occurred" }
        }
    })

const registerSchema = z.object({
    email: z.string().email(),
    name: z.string().min(2),
    password: z.string().min(8),
})

export const register = action
    .schema(registerSchema)
    .action(async ({ parsedInput: { email, name, password } }) => {
        console.log("Registering with email:", email);
        const salt = crypto.randomBytes(128).toString("base64");
        const hash = await hashPassword(password, salt);
        try {
            const existingUser = await prisma.user.findUnique({
                where: { email }
            })

            if (existingUser) {
                throw new EmailInUseError()
            }

            const user = await prisma.user.create({
                data: {
                    email,
                    name,
                    HasAccount: {
                        create: {
                            password: hash,
                        }
                    }
                }
            })
            console.log("user", user)
            console.log("setting session")
            await setSession(user.id);

            return { success: "Successfully registered", userId: user.id }
        } catch (error) {
            if (error instanceof EmailInUseError) {
                return { failure: "Email is already in use" }
            }
            console.error("Registration error:", error)
            return { failure: "An unexpected error occurred during registration" }
        }
    })

export async function deleteUserAction(userId: string) {
    try {
        console.log(`[deleteUser] Deleting user with ID: ${userId}`)
        await prisma.user.delete({ where: { id: userId } })
        return { success: true }
    } catch (error) {
        console.error(`[deleteUserAction] Error:`, error)
        return { failure: "An unexpected error occurred while deleting the user" }
    }
}

export async function updateUserAction(data: {
    userId: string,
    userData: {
        role?: "USER" | "ADMIN" | "SUPER"
        name?: string
        email?: string
    }
}) {
    try {
        console.log(`[updateUser] Updating user with ID: ${data.userId}`)
        const user = await prisma.user.update({
            where: { id: data.userId },
            data: data.userData
        })
        return { success: true, data: user }
    } catch (error) {
        console.error(`[updateUserAction] Error:`, error)
        return { failure: "An unexpected error occurred while updating the user" }
    }
}

export async function getUserByEmailAction(email: string) {
    try {
        console.log(`[getUserByEmail] Fetching user with email: ${email}`)
        const user = await prisma.user.findUnique({
            where: { email }
        })
        return { success: true, data: user }
    } catch (error) {
        console.error(`[getUserByEmailAction] Error:`, error)
        return { failure: "An unexpected error occurred while fetching the user by email" }
    }
}

export async function getAllUsers() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true
            }
        })
        return users
    } catch (error) {
        console.error("Get all users error:", error)
        return null
    }
}
export const logout = action
    .schema(z.object({}))
    .action(async () => {
        try {
            await setSession(null);
        } catch (error) {
            console.error("Logout error:", error);
            return { failure: "An unexpected error occurred" };
        } finally {
            revalidatePath("/");
            redirect("/");
        }

    });
