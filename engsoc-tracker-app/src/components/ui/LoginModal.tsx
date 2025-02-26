'use client'
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./dialog"
import { Button } from "./button"
import { Input } from "./input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2 } from "lucide-react"
import { login, register } from "@/app/server-actions/users"
import { ErrorMessage } from "@hookform/error-message"

const formSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    name: z.string().min(2, 'Name must be at least 2 characters').optional().or(z.literal('')),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Password must be at least 8 characters').optional().or(z.literal('')),
    error: z.string().optional(),
}).refine((data) => {
    if (data.confirmPassword && data.confirmPassword.length > 0) {
        return data.password === data.confirmPassword
    }
    return true
}, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})


type FormValues = z.infer<typeof formSchema>

export function LoginModal({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false)
    const [isSignUp, setIsSignUp] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            name: '',
            password: '',
            confirmPassword: '',
            error: ''
        },
        mode: 'onChange',
    })

    const onSubmit = async (data: FormValues) => {
        setIsLoading(true)
        console.log("submitting form");
        setError(null)
        try {
            const res = isSignUp
                ? await register({
                    email: data.email,
                    name: data.name || '',
                    password: data.password
                })
                : await login({
                    email: data.email,
                    password: data.password
                });
            console.log("res.data: ", res?.data);
            if (!res) {
                throw new Error('No response')
            }
            if (res.data?.success) {
                setIsOpen(false)
                window.location.reload() // Refresh to update auth state
            } else {
                throw new Error(res.data?.failure)
            }
        } catch (err) {
            setError(String(err).length > 0 ? String(err) : 'An error occurred (len 0)')
        } finally {
            setIsLoading(false)
        }
    }

    console.log("form.formState.errors", form.formState.errors);
    console.log("error", error);
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {isSignUp ? 'Create an account' : 'Welcome back'}
                    </DialogTitle>
                    <DialogDescription>
                        {isSignUp ? 'Sign up to contribute applications' : 'Sign in to your account'}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="your@email.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {isSignUp && (
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Your name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Your password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {isSignUp && (
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Confirm your password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </>
                            ) : (
                                isSignUp ? 'Sign Up' : 'Log In'
                            )}
                        </Button>
                        {error && (
                            <p className="text-destructive text-sm">
                                {error}
                            </p>
                        )}
                    </form>
                </Form>
                <div className="text-center">
                    <Button
                        variant="link"
                        onClick={() => {
                            setIsSignUp(!isSignUp)
                            form.reset()
                            setError(null)
                        }}
                    >
                        {isSignUp ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}