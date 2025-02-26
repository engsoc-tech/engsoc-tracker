import { useState, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { getCurrentUser } from '@/lib/session'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { updateUserAction } from '../server-actions/users'
import { invokeFunctionAction } from './actions'
import { Input } from '@/components/ui/input'

interface AdminDashboardProps {
    serverSideData: {
        users: Array<{
            id: string
            email: string
            name: string
            role: "USER" | "ADMIN" | "SUPER"
        }>
        unverifiedApplications: Array<{
            id: string
            company: string
            programme: string
            type: string
            link: string
        }>
    }
}

export default function AdminDashboard({ serverSideData }: AdminDashboardProps) {
    const [selectedUser, setSelectedUser] = useState<any>(null)
    const [currentUser, setCurrentUser] = useState<any>(null)
    const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false)
    const [testUrl, setTestUrl] = useState('')
    const [testResult, setTestResult] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const fetchCurrentUser = async () => {
            const user = await getCurrentUser()
            setCurrentUser(user)
        }
        fetchCurrentUser()
    }, [])

    const handleRoleUpdate = async (newRole: "USER" | "ADMIN") => {
        if (!selectedUser) return

        try {
            const result = await updateUserAction({
                userId: selectedUser.id,
                userData: { role: newRole }
            })

            if (result.success) {
                // Refresh the page to get updated data
                window.location.reload()
            }
        } catch (error) {
            console.error('Failed to update role:', error)
        }

        setIsRoleDialogOpen(false)
    }

    const handleVerifyApplication = async (applicationId: string) => {
        try {
            const response = await fetch(`/api/applications/${applicationId}/verify`, {
                method: 'POST'
            })
            if (response.ok) {
                // Refresh the page to get updated data
                window.location.reload()
            }
        } catch (error) {
            console.error('Failed to verify application:', error)
        }
    }
    const handleTestFunction = async () => {
        if (!testUrl) return
        setIsLoading(true)
        try {
            const result = await invokeFunctionAction({ input: testUrl })
            setTestResult(result as any)
        } catch (error) {
            console.error('Test function failed:', error)
            setTestResult('Error: ' + (error instanceof Error ? error.message : String(error)))
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

            <Tabs defaultValue="applications">
                <TabsList>
                    <TabsTrigger value="applications">Unverified Applications</TabsTrigger>
                    <TabsTrigger value="users">Users</TabsTrigger>
                    {currentUser?.role === "SUPER" && (
                        <TabsTrigger value="Super">Super</TabsTrigger>
                    )}
                </TabsList>

                <TabsContent value="users" className="mt-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {serverSideData.users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>
                                        {currentUser?.role === "SUPER" && (
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setSelectedUser(user)
                                                    setIsRoleDialogOpen(true)
                                                }}
                                            >
                                                Change Role
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TabsContent>

                <TabsContent value="applications" className="mt-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Company</TableHead>
                                <TableHead>Programme</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Link</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {serverSideData.unverifiedApplications.map((app) => (
                                <TableRow key={app.id}>
                                    <TableCell>{app.company}</TableCell>
                                    <TableCell>{app.programme}</TableCell>
                                    <TableCell>{app.type}</TableCell>
                                    <TableCell>
                                        <a href={app.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                            View
                                        </a>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outline"
                                            onClick={() => handleVerifyApplication(app.id)}
                                        >
                                            Verify
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TabsContent>
                {currentUser?.role === "SUPER" && (
                    <TabsContent value="Super" className="mt-6">
                        <div className="space-y-6">
                            <div className="p-6 border rounded-lg space-y-4">
                                <h2 className="text-xl font-semibold mb-4">Test Functions</h2>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-lg font-medium mb-2">Add input?</h3>
                                        <div className="flex gap-4">
                                            <Input
                                                placeholder="Enter Gradcracker URL"
                                                value={testUrl}
                                                onChange={(e) => setTestUrl(e.target.value)}
                                                className="flex-1"
                                            />
                                            <Button
                                                onClick={handleTestFunction}
                                                disabled={isLoading}
                                            >
                                                Test
                                            </Button>
                                        </div>
                                        {testResult && (
                                            <div className="mt-4 p-4 bg-gray-100 rounded">
                                                <pre className="whitespace-pre-wrap break-words">
                                                    {JSON.stringify(testResult, null, 2)}
                                                </pre>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                )}
            </Tabs>

            <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Change User Role</DialogTitle>
                        <DialogDescription>
                            Select a new role for {selectedUser?.name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-center gap-4 mt-4">
                        <Button
                            variant="outline"
                            onClick={() => handleRoleUpdate("USER")}
                        >
                            Set as User
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => handleRoleUpdate("ADMIN")}
                        >
                            Set as Admin
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}