import ProtectedRoute from '@/app/components/ProtectedRoute'
import WelcomeContent from './WelcomeContent'

export default function WelcomePage() {
    return (
        <ProtectedRoute>
            <WelcomeContent />
        </ProtectedRoute>
    )
}
