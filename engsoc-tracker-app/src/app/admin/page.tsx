'use client'
import { useEffect, useState } from 'react'
import AdminDashboard from './AdminDashboard'
import { getCurrentUser } from '@/lib/session'
import { redirect } from 'next/navigation'

async function fetchServerSideData() {
    const [] = await Promise.all([]);
    return {
        users: [],
        unverifiedApplications: []
    }
}
export default function AdminDashboardPage() {
    const [serverSideData, setServerSideData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const init = async () => {
            try {
                const user = await getCurrentUser()
                if (!user || (user.role !== "ADMIN" && user.role !== "SUPER")) {
                    redirect('/')
                }
                const data = await fetchServerSideData()
                setServerSideData(data)
            } catch (e) {
                setError(String(e))

            } finally {
                setIsLoading(false)
            }
        }

        init()
    }, [])

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>{error}</div>
    }

    return <AdminDashboard serverSideData={serverSideData} />
}