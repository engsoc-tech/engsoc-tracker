import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getCurrentUser } from '@/lib/session';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { toast } from '@/hooks/use-toast';
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ExternalLink } from "lucide-react";
import {
    deleteApplicationAction,
    deleteButtonClickAction,
    getAppConfigAction,
    getApplicationsAction,
    getUsersAction,
    invokeFunctionAction,
    migrateDbAction,
    scrapeAllSourcesAction,
    updateAppConfigAction,
    updateApplicationAction,
    updateUserRoleAction,
    verifyApplicationAction
} from './actions';
import { format } from 'date-fns';
import { EngineeringType, PositionType, Role } from '@prisma/client';

interface User {
    id: string;
    email: string;
    name: string;
    role: Role;
    lastSignedIn?: Date;
}

interface Application {
    id: string;
    programme: string;
    origProgramme: string;
    company: string;
    type: PositionType;
    engineering: EngineeringType[];
    openDate: Date;
    closeDate: Date;
    requiresCv?: boolean;
    requiresCoverLetter?: boolean;
    requiresWrittenAnswers?: boolean;
    notes?: string;
    link: string;
    isSponsored: boolean;
    verified: boolean;
    postChecked: boolean;
}

interface AppConfig {
    id: string;
    lastUpdated: Date;
    shouldKeepUpdating: boolean;
    maxInEachDiscipline: number;
    maxInEachType: number;
}

export default function AdminDashboard() {
    // State
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
    const [testUrl, setTestUrl] = useState('');
    const [testResult, setTestResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [applications, setApplications] = useState<Application[]>([]);
    const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
    const [isApplicationEditDialogOpen, setIsApplicationEditDialogOpen] = useState(false);
    const [editedApplication, setEditedApplication] = useState<Partial<Application>>({});
    const [appConfig, setAppConfig] = useState<AppConfig | null>(null);
    const [isAppConfigDialogOpen, setIsAppConfigDialogOpen] = useState(false);
    const [editedAppConfig, setEditedAppConfig] = useState<Partial<AppConfig>>({});
    const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
    const [applicationToDelete, setApplicationToDelete] = useState<string | null>(null);

    // Fetch data on load
    useEffect(() => {
        const fetchCurrentUser = async () => {
            const user = await getCurrentUser();
            setCurrentUser(user as User);
        };

        const fetchData = async () => {
            await fetchUsers();
            await fetchApplications();
            await fetchAppConfig();
        };

        fetchCurrentUser();
        fetchData();
    }, []);

    // Fetch functions
    const fetchUsers = async () => {
        try {
            const result = await getUsersAction();
            if (result?.data?.success && result.data.data) {
                setUsers(result.data.data);
            } else {
                toast({
                    title: "Error",
                    description: result?.data?.error || "Failed to fetch users",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const fetchApplications = async () => {
        try {
            const result = await getApplicationsAction();
            if (result?.data?.success && result.data.data) {
                setApplications(result.data.data);
            } else {
                toast({
                    title: "Error",
                    description: result?.data?.error || "Failed to fetch applications",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error("Error fetching applications:", error);
        }
    };

    const fetchAppConfig = async () => {
        try {
            const result = await getAppConfigAction();
            if (result?.data?.success && result.data.data) {
                setAppConfig(result.data.data);
            }
        } catch (error) {
            console.error("Error fetching app config:", error);
        }
    };

    // User functions
    const handleRoleUpdate = async (newRole: "USER" | "ADMIN" | "SUPER") => {
        if (!selectedUser) return;

        try {
            setIsLoading(true);
            const result = await updateUserRoleAction({
                userId: selectedUser.id,
                role: newRole
            });

            if (result?.data?.success) {
                toast({
                    title: "Role Updated",
                    description: `${selectedUser.name}'s role has been updated to ${newRole}`,
                });
                await fetchUsers();
            } else {
                toast({
                    title: "Error",
                    description: result?.data?.error || "Failed to update user role",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error('Failed to update role:', error);
            toast({
                title: "Error",
                description: "Failed to update user role",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
            setIsRoleDialogOpen(false);
        }
    };

    // Application functions
    const handleVerifyApplication = async (applicationId: string) => {
        try {
            setIsLoading(true);
            const result = await verifyApplicationAction({ id: applicationId });

            if (result?.data?.success) {
                toast({
                    title: "Application Verified",
                    description: "The application has been verified successfully",
                });
                await fetchApplications();
            } else {
                toast({
                    title: "Error",
                    description: result?.data?.error || "Failed to verify application",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error('Failed to verify application:', error);
            toast({
                title: "Error",
                description: "Failed to verify application",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditApplication = (application: Application) => {
        setSelectedApplication(application);
        setEditedApplication({
            ...application,
            openDate: new Date(application.openDate),
            closeDate: new Date(application.closeDate)
        });
        setIsApplicationEditDialogOpen(true);
    };

    const handleSaveApplication = async () => {
        if (!selectedApplication || !editedApplication) return;

        try {
            setIsLoading(true);
            const result = await updateApplicationAction({
                id: selectedApplication.id,
                programme: editedApplication.programme || selectedApplication.programme,
                origProgramme: editedApplication.origProgramme || selectedApplication.origProgramme,
                company: editedApplication.company || selectedApplication.company,
                type: editedApplication.type || selectedApplication.type,
                engineering: editedApplication.engineering || selectedApplication.engineering,
                openDate: editedApplication.openDate || selectedApplication.openDate,
                closeDate: editedApplication.closeDate || selectedApplication.closeDate,
                requiresCv: editedApplication.requiresCv !== undefined ? editedApplication.requiresCv : selectedApplication.requiresCv,
                requiresCoverLetter: editedApplication.requiresCoverLetter !== undefined ? editedApplication.requiresCoverLetter : selectedApplication.requiresCoverLetter,
                requiresWrittenAnswers: editedApplication.requiresWrittenAnswers !== undefined ? editedApplication.requiresWrittenAnswers : selectedApplication.requiresWrittenAnswers,
                notes: editedApplication.notes !== undefined ? editedApplication.notes : selectedApplication.notes,
                link: editedApplication.link || selectedApplication.link,
                isSponsored: editedApplication.isSponsored !== undefined ? editedApplication.isSponsored : selectedApplication.isSponsored,
                verified: editedApplication.verified !== undefined ? editedApplication.verified : selectedApplication.verified,
                postChecked: editedApplication.postChecked !== undefined ? editedApplication.postChecked : selectedApplication.postChecked
            } as any);

            if (result?.data?.success) {
                toast({
                    title: "Application Updated",
                    description: "The application has been updated successfully",
                });
                await fetchApplications();
                setIsApplicationEditDialogOpen(false);
            } else {
                toast({
                    title: "Error",
                    description: result?.data?.error || "Failed to update application",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error('Failed to update application:', error);
            toast({
                title: "Error",
                description: "Failed to update application",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteConfirmation = (applicationId: string) => {
        setApplicationToDelete(applicationId);
        setIsConfirmDeleteDialogOpen(true);
    };

    const handleDeleteApplication = async () => {
        if (!applicationToDelete) return;

        try {
            setIsLoading(true);
            const result = await deleteApplicationAction({ id: applicationToDelete });

            if (result?.data?.success) {
                toast({
                    title: "Application Deleted",
                    description: "The application has been deleted successfully",
                });
                await fetchApplications();
                setIsConfirmDeleteDialogOpen(false);
            } else {
                toast({
                    title: "Error",
                    description: result?.data?.error || "Failed to delete application",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error('Failed to delete application:', error);
            toast({
                title: "Error",
                description: "Failed to delete application",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
            setApplicationToDelete(null);
        }
    };

    // App Config functions
    const handleEditAppConfig = () => {
        if (appConfig) {
            setEditedAppConfig({
                ...appConfig
            });
            setIsAppConfigDialogOpen(true);
        } else {
            setEditedAppConfig({
                shouldKeepUpdating: true,
                maxInEachDiscipline: 10,
                maxInEachType: 10
            });
            setIsAppConfigDialogOpen(true);
        }
    };

    const handleSaveAppConfig = async () => {
        if (!editedAppConfig) return;

        try {
            setIsLoading(true);
            const result = await updateAppConfigAction({
                shouldKeepUpdating: Boolean(editedAppConfig.shouldKeepUpdating),
                maxInEachDiscipline: Number(editedAppConfig.maxInEachDiscipline) || 10,
                maxInEachType: Number(editedAppConfig.maxInEachType) || 10
            });

            if (result?.data?.success) {
                toast({
                    title: "Config Updated",
                    description: "The application config has been updated successfully",
                });
                await fetchAppConfig();
                setIsAppConfigDialogOpen(false);
            } else {
                toast({
                    title: "Error",
                    description: result?.data?.error || "Failed to update config",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error('Failed to update config:', error);
            toast({
                title: "Error",
                description: "Failed to update config",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Super Admin actions
    const handleTestFunction = async () => {
        if (!testUrl) return;
        setIsLoading(true);
        setTestResult(null);

        try {
            const result = await invokeFunctionAction({ input: testUrl });
            setTestResult(JSON.stringify(result, null, 2));

            if (result?.data?.success) {
                toast({
                    title: "Test Completed",
                    description: result.data.message || "Function test completed successfully",
                });
            } else {
                toast({
                    title: "Warning",
                    description: result?.data?.error || "Test completed with warnings",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error('Test function failed:', error);
            setTestResult('Error: ' + (error instanceof Error ? error.message : String(error)));
            toast({
                title: "Error",
                description: "Test function failed",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleScrapeAllSources = async () => {
        console.log("Start all sources clicked");
        setIsLoading(true);
        setTestResult(null);

        try {
            const result = await scrapeAllSourcesAction();
            setTestResult(JSON.stringify(result, null, 2));

            if (result?.data?.success) {
                toast({
                    title: "Job completed",
                    description: result.data.message || "Starting all sources completed successfully",
                });
            } else {
                toast({
                    title: "Warning",
                    description: result?.data?.error || "Process completed with warnings",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error('Process failed:', error);
            setTestResult('Error: ' + (error instanceof Error ? error.message : String(error)));
            toast({
                title: "Error",
                description: "Process failed",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleMigrate = async () => {
        console.log("Migrate clicked");
        setIsLoading(true);
        setTestResult(null);

        try {
            const result = await migrateDbAction();
            setTestResult(JSON.stringify(result, null, 2));

            if (result?.data?.success) {
                toast({
                    title: "Migration completed",
                    description: result.data.message || "Migration completed successfully",
                });
            } else {
                toast({
                    title: "Warning",
                    description: result?.data?.error || "Migration completed with warnings",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error('Migration failed:', error);
            setTestResult('Error: ' + (error instanceof Error ? error.message : String(error)));
            toast({
                title: "Error",
                description: "Migration failed",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteButtonClick = async () => {
        try {
            setIsLoading(true);
            const result = await deleteButtonClickAction();

            if (result?.data?.data.success) {
                toast({
                    title: "Deletion completed",
                    description: result.data.message || "All applications deleted successfully",
                });
                await fetchApplications();
            } else {
                toast({
                    title: "Error",
                    description: result?.data?.message || "Failed to delete applications",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error('Failed to delete applications:', error);
            toast({
                title: "Error",
                description: "Failed to delete applications",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Utility functions
    const getStatusBadge = (verified: boolean, isSponsored: boolean) => {
        if (isSponsored) {
            return <Badge variant="secondary">Sponsored</Badge>;
        }
        if (verified) {
            return <Badge variant="default">Verified</Badge>;
        }
        return <Badge variant="outline">Unverified</Badge>;
    };

    const formatDate = (date: Date | string | undefined) => {
        if (!date) return 'N/A';
        try {
            return format(new Date(date), 'dd/MM/yyyy');
        } catch (error) {
            return 'Invalid date';
        }
    };

    // Truncate long URLs for display
    const truncateUrl = (url: string, maxLength = 40) => {
        if (url.length <= maxLength) return url;
        return url.substring(0, maxLength) + '...';
    };

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

            <Tabs defaultValue="applications">
                <TabsList>
                    <TabsTrigger value="applications">Applications</TabsTrigger>
                    <TabsTrigger value="users">Users</TabsTrigger>
                    {currentUser?.role === "SUPER" && (
                        <TabsTrigger value="Super">Super Admin</TabsTrigger>
                    )}
                </TabsList>

                <TabsContent value="users" className="mt-6">
                    <div className="mb-4">
                        <h2 className="text-xl font-bold mb-2">User Management</h2>
                        <p className="text-gray-500">Total users: {users.length}</p>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Last Signed In</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                user.role === "SUPER" ? "destructive" :
                                                    user.role === "ADMIN" ? "default" : "outline"
                                            }
                                        >
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{user.lastSignedIn ? formatDate(user.lastSignedIn) : 'Never'}</TableCell>
                                    <TableCell>
                                        {currentUser?.role === "SUPER" && (
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setIsRoleDialogOpen(true);
                                                }}
                                                disabled={isLoading}
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
                    <div className="mb-4">
                        <h2 className="text-xl font-bold mb-2">Application Management</h2>
                        <p className="text-gray-500">Showing {applications.length} applications</p>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Company</TableHead>
                                <TableHead>Programme</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Link</TableHead>
                                <TableHead>Deadline</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {applications.map((app) => (
                                <TableRow key={app.id}>
                                    <TableCell>{app.company}</TableCell>
                                    <TableCell>{app.programme}</TableCell>
                                    <TableCell>{app.type}</TableCell>
                                    <TableCell>{getStatusBadge(app.verified, app.isSponsored)}</TableCell>
                                    <TableCell className="max-w-xs">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm truncate" title={app.link}>
                                                {truncateUrl(app.link)}
                                            </span>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => window.open(app.link, '_blank')}
                                                className="h-8 w-8"
                                                title="Open link"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                    <TableCell>{formatDate(app.closeDate)}</TableCell>
                                    <TableCell className="space-x-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => handleVerifyApplication(app.id)}
                                            disabled={isLoading || app.verified}
                                            size="sm"
                                        >
                                            Verify
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => handleEditApplication(app)}
                                            disabled={isLoading}
                                            size="sm"
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            onClick={() => handleDeleteConfirmation(app.id)}
                                            disabled={isLoading}
                                            size="sm"
                                        >
                                            Delete
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
                                <h2 className="text-xl font-semibold mb-4">Application Config</h2>
                                {appConfig && (
                                    <div className="space-y-2">
                                        <p><strong>Last Updated:</strong> {formatDate(appConfig.lastUpdated)}</p>
                                        <p><strong>Auto-updating:</strong> {appConfig.shouldKeepUpdating ? 'Enabled' : 'Disabled'}</p>
                                        <p><strong>Max Per Discipline:</strong> {appConfig.maxInEachDiscipline}</p>
                                        <p><strong>Max Per Type:</strong> {appConfig.maxInEachType}</p>
                                        <Button
                                            onClick={handleEditAppConfig}
                                            className="mt-2"
                                        >
                                            Edit Config
                                        </Button>
                                    </div>
                                )}
                                {!appConfig && (
                                    <div>
                                        <p>No configuration found</p>
                                        <Button
                                            onClick={handleEditAppConfig}
                                            className="mt-2"
                                        >
                                            Create Config
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 border rounded-lg space-y-4">
                                <h2 className="text-xl font-semibold mb-4">Test Functions</h2>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-lg font-medium mb-2">Test Input</h3>
                                        <div className="flex gap-4">
                                            <Input
                                                placeholder="Enter input"
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
                                    </div>
                                </div>
                                {testResult && (
                                    <div className="mt-4 p-4 bg-gray-100 rounded">
                                        <pre className="whitespace-pre-wrap break-words">
                                            {testResult}
                                        </pre>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <Button onClick={handleScrapeAllSources} disabled={isLoading}>
                                    Start All Sources
                                </Button>
                                <Button onClick={handleMigrate} disabled={isLoading}>
                                    Migrate DB
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleDeleteButtonClick}
                                    disabled={isLoading}
                                    className="ml-auto"
                                >
                                    Delete All Applications
                                </Button>
                            </div>
                        </div>
                    </TabsContent>
                )}
            </Tabs>

            {/* User Role Dialog */}
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
                            disabled={isLoading}
                        >
                            Set as User
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => handleRoleUpdate("ADMIN")}
                            disabled={isLoading}
                        >
                            Set as Admin
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => handleRoleUpdate("SUPER")}
                            disabled={isLoading}
                        >
                            Set as Super Admin
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Application Edit Dialog */}
            <Dialog open={isApplicationEditDialogOpen} onOpenChange={setIsApplicationEditDialogOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Edit Application</DialogTitle>
                        <DialogDescription>
                            Modify the application details below
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-2 gap-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Company</label>
                            <Input
                                value={editedApplication.company || ''}
                                onChange={(e) => setEditedApplication({ ...editedApplication, company: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Programme</label>
                            <Input
                                value={editedApplication.programme || ''}
                                onChange={(e) => setEditedApplication({ ...editedApplication, programme: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Type</label>
                            <select
                                className="w-full p-2 border rounded"
                                value={editedApplication.type || ''}
                                onChange={(e) => setEditedApplication({
                                    ...editedApplication,
                                    type: e.target.value as PositionType
                                })}
                            >
                                <option value="Graduate">Graduate</option>
                                <option value="Internship">Internship</option>
                                <option value="Placement">Placement</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Link</label>
                            <Input
                                value={editedApplication.link || ''}
                                onChange={(e) => setEditedApplication({ ...editedApplication, link: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Open Date</label>
                            <Input
                                type="date"
                                value={editedApplication.openDate ? format(new Date(editedApplication.openDate), 'yyyy-MM-dd') : ''}
                                onChange={(e) => {
                                    const date = e.target.value ? new Date(e.target.value) : null;
                                    setEditedApplication({ ...editedApplication, openDate: date as Date });
                                }}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Close Date</label>
                            <Input
                                type="date"
                                value={editedApplication.closeDate ? format(new Date(editedApplication.closeDate), 'yyyy-MM-dd') : ''}
                                onChange={(e) => {
                                    const date = e.target.value ? new Date(e.target.value) : null;
                                    setEditedApplication({ ...editedApplication, closeDate: date as Date });
                                }}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Notes</label>
                            <Input
                                value={editedApplication.notes || ''}
                                onChange={(e) => setEditedApplication({ ...editedApplication, notes: e.target.value })}
                            />
                        </div>

                        <div className="col-span-2 space-y-2">
                            <label className="text-sm font-medium">Engineering Types</label>
                            <div className="grid grid-cols-3 gap-2">
                                {Object.values(EngineeringType).map((type) => (
                                    <div key={type} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`eng-${type}`}
                                            checked={editedApplication.engineering?.includes(type)}
                                            onCheckedChange={(checked) => {
                                                const currentTypes = editedApplication.engineering || [];
                                                const updatedTypes = checked
                                                    ? [...currentTypes, type]
                                                    : currentTypes.filter(t => t !== type);

                                                setEditedApplication({
                                                    ...editedApplication,
                                                    engineering: updatedTypes as EngineeringType[]
                                                });
                                            }}
                                        />
                                        <label htmlFor={`eng-${type}`}>{type}</label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="requiresCv"
                                    checked={editedApplication.requiresCv}
                                    onCheckedChange={(checked) => {
                                        setEditedApplication({ ...editedApplication, requiresCv: !!checked });
                                    }}
                                />
                                <label htmlFor="requiresCv">Requires CV</label>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="requiresCoverLetter"
                                    checked={editedApplication.requiresCoverLetter}
                                    onCheckedChange={(checked) => {
                                        setEditedApplication({ ...editedApplication, requiresCoverLetter: !!checked });
                                    }}
                                />
                                <label htmlFor="requiresCoverLetter">Requires Cover Letter</label>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="requiresWrittenAnswers"
                                    checked={editedApplication.requiresWrittenAnswers}
                                    onCheckedChange={(checked) => {
                                        setEditedApplication({ ...editedApplication, requiresWrittenAnswers: !!checked });
                                    }}
                                />
                                <label htmlFor="requiresWrittenAnswers">Requires Written Answers</label>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="isSponsored"
                                    checked={editedApplication.isSponsored}
                                    onCheckedChange={(checked) => {
                                        setEditedApplication({ ...editedApplication, isSponsored: !!checked });
                                    }}
                                />
                                <label htmlFor="isSponsored">Is Sponsored</label>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="verified"
                                    checked={editedApplication.verified}
                                    onCheckedChange={(checked) => {
                                        setEditedApplication({ ...editedApplication, verified: !!checked });
                                    }}
                                />
                                <label htmlFor="verified">Verified</label>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="postChecked"
                                    checked={editedApplication.postChecked}
                                    onCheckedChange={(checked) => {
                                        setEditedApplication({ ...editedApplication, postChecked: !!checked });
                                    }}
                                />
                                <label htmlFor="postChecked">Post Checked</label>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsApplicationEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveApplication} disabled={isLoading}>
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* App Config Dialog */}
            <Dialog open={isAppConfigDialogOpen} onOpenChange={setIsAppConfigDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Application Config</DialogTitle>
                        <DialogDescription>
                            Modify the application configuration settings
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="shouldKeepUpdating"
                                checked={editedAppConfig.shouldKeepUpdating}
                                onCheckedChange={(checked) => {
                                    setEditedAppConfig({ ...editedAppConfig, shouldKeepUpdating: !!checked });
                                }}
                            />
                            <label htmlFor="shouldKeepUpdating">Enable Auto-Updating</label>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Max Applications Per Discipline</label>
                            <Input
                                type="number"
                                min="1"
                                value={editedAppConfig.maxInEachDiscipline || ''}
                                onChange={(e) => setEditedAppConfig({
                                    ...editedAppConfig,
                                    maxInEachDiscipline: parseInt(e.target.value) || 10
                                })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Max Applications Per Type</label>
                            <Input
                                type="number"
                                min="1"
                                value={editedAppConfig.maxInEachType || ''}
                                onChange={(e) => setEditedAppConfig({
                                    ...editedAppConfig,
                                    maxInEachType: parseInt(e.target.value) || 10
                                })}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAppConfigDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveAppConfig} disabled={isLoading}>
                            Save Config
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Confirm Delete Dialog */}
            <Dialog open={isConfirmDeleteDialogOpen} onOpenChange={setIsConfirmDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this application? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsConfirmDeleteDialogOpen(false);
                                setApplicationToDelete(null);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteApplication}
                            disabled={isLoading}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}