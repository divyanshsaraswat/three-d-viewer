import { redirect } from 'next/navigation';

// Redirect legacy /home route to the new root page
export default function HomePage() {
    redirect('/');
}
