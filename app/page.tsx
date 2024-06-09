import { HomePage } from '@/components/home-page';
import { auth, currentUser } from '@clerk/nextjs';
import { User } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function Home() {
  const user: User | null = await currentUser();
  const isLoggedIn = !!user;
  if (isLoggedIn) {
    redirect('/home');
  }

  return (
    <main className="sm:p-7 sm:pb-0">
      <HomePage />
    </main>
  );
}
