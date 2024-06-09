'use client';
import { DropdownMenuDemo } from '@/components/navbar/navbar_logged_in';
import { PinContainer } from '@/components/ui/framerui/3d-pin';
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './App.css';
import { useClerk, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { BackgroundBeams } from '@/components/ui/framerui/background_beams';
import Chart from 'chart.js/auto';
import SkeletonPage from './components/skeleton_loader';

export default function AnimatedPinDemo() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx && chartInstance.current) {
        chartInstance.current.destroy();
      }

      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June'],
            datasets: [
              {
                label: 'Commits',
                data: [10, 20, 15, 30, 25, 35],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: false,
              },
            },
          },
        });
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey && event.key === '1') {
        router.push('/profile');
      } else if (event.altKey && event.key === '2') {
        router.push('/billing');
      } else if (event.altKey && event.key === '3') {
        router.push('/settings');
      } else if (event.altKey && event.key === '4') {
        router.push('/keyboard-shortcuts');
      } else if (event.altKey && event.key === '5') {
        router.push('/team');
      } else if (event.altKey && event.key === '6') {
        router.push('/github');
      } else if (event.altKey && event.key === '7') {
        router.push('/support');
      } else if (event.altKey && event.key === '8') {
        router.push('/api');
      } else if (event.altKey && event.key === '9') {
        handleLogout();
      } else if (event.altKey && event.key === '0') {
        router.push('/next');
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn) {
    return <SkeletonPage />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center  animated-gradient relative">
        <PinContainer title="Resume Learning" href="/question/1">
          <BackgroundBeams />
          <motion.div
            layoutId="heroContainer"
            className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[20rem]"
          >
            <h3 className="max-w-xs !pb-2 !m-0 font-bold text-base text-slate-100 flex items-center justify-between">
              <span className="text-3xl">CodeButter</span>
              <DropdownMenuDemo
                userProfile={user}
                onLogout={handleLogout}
              ></DropdownMenuDemo>
            </h3>
            <div className="text-base !m-0 !p-0 font-normal">
              <span className="text-slate-500">
                Here are some stats, {user.username}
              </span>
            </div>
            {/* Enhanced stats */}
            <div className="mt-4">
              <div className="text-sm font-semibold text-slate-400">
                Coding Frequency:{' '}
                <span className="text-slate-200">5 days/week</span>
              </div>
              <div className="text-sm font-semibold text-slate-400">
                Current Level:{' '}
                <span className="text-slate-200">Intermediate</span>
              </div>
              <div className="text-sm font-semibold text-slate-400">
                Streak: <span className="text-slate-200">35</span>
              </div>
              <canvas
                id="commitChart"
                ref={chartRef}
                width="400"
                height="200"
              ></canvas>
            </div>
          </motion.div>
        </PinContainer>
      </div>
    </div>
  );
}
