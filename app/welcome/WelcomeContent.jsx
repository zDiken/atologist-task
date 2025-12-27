'use client'

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './welcome.module.scss';
import { logout, getAuthState } from '@/app/lib/auth';

export default function WelcomeContent() {
    const router = useRouter();
    const user = getAuthState();

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <main className={styles.container}>
            <div className={styles.card}>
                <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
                <div className={styles.content}>
                    <div className={styles.sparkles} aria-hidden="true">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <h1 className={styles.title}>Welcome {user?.firstname}!</h1>
                    <p className={styles.subtitle}>Your account was created successfully. Enjoy exploring!</p>
                    <div className={styles.actions}>
                        <Link href="/" className={styles.cta}>Go to Home</Link>
                        <Link href="#" className={styles.secondary}>Visit Dashboard</Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
