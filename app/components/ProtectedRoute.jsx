'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isLoggedIn } from '@/app/lib/auth';

export default function ProtectedRoute({ children }) {
    const router = useRouter();
    const [isAuthed, setIsAuthed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            const loggedIn = isLoggedIn();
            if (!loggedIn) {
                router.push('/');
                return;
            }
            setIsAuthed(true);
            setIsLoading(false);
        };

        checkAuth();
    }, [router]);

    if (isLoading) {
        return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: '#6b7280' }}>Loading...</div>;
    }

    return isAuthed ? children : null;
}
