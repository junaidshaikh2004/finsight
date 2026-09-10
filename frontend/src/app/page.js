'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import LandingNav from '@/components/landing/LandingNav';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import Footer from '@/components/landing/Footer';
import Spinner from '@/components/ui/Spinner';

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [loading, user, router]);

  // Avoid flashing marketing content at an already-logged-in user while we redirect them.
  if (loading || user) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <LandingNav />
      <main className="flex-1">
        <Hero />
        <Features />
      </main>
      <Footer />
    </>
  );
}
