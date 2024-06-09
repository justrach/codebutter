'use client';
import {
  DropdownMenuDemo,
  NavBarLoggedIn,
} from '@/components/navbar/navbar_logged_in';
import { PinContainer } from '@/components/ui/framerui/3d-pin';
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './App.css';
import { useClerk, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { BackgroundBeams } from '@/components/ui/framerui/background_beams';

import Chart from 'chart.js/auto';
import { Button } from '@/components/ui/button';

const navbarVariants = {
  hidden: { y: -100, opacity: 0, scale: 0.9 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  },
  exit: {
    y: -100,
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 0.3,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  },
};

export default function AnimatedPinDemo() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [showNavbar, setShowNavbar] = useState(false);
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);
  

  const handleMouseMove = (event:any) => {
    const { clientY } = event;
    if (clientY <= 100) {
      setShowNavbar(true);
    } else {
      setShowNavbar(false);
    }
  };

  const handleTouchStart = () => {
    setShowNavbar(true);
  };

  const handleTouchEnd = () => {
    setShowNavbar(false);
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);



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
        },
      });
    }
  }

  return () => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
  };
}, [isLoaded, isSignedIn]);

  if (!isLoaded || !isSignedIn) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center animated-gradient relative">
        <PinContainer title="Resume Learning" href="/question/1">
          <BackgroundBeams />
          <motion.div
            layoutId="heroContainer"
            className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[20rem]"
          >
            <h3 className="max-w-xs !pb-2 !m-0 font-bold text-base text-slate-100 flex items-center justify-between">
              <span>CodeButter</span>
              <DropdownMenuDemo
                userProfile={user}
                onLogout={signOut}
              ></DropdownMenuDemo>
            </h3>
            <div className="text-base !m-0 !p-0 font-normal">
              <span className="text-slate-500">
                Here are some stats, carbonoatom
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
                Commits this Month: <span className="text-slate-200">35</span>
              </div>
              <canvas
                id="commitChart"
                ref={chartRef}
                width="400"
                height="200"
              ></canvas>
            </div>
            {/* "Start Today" button */}
          </motion.div>
        </PinContainer>
      </div>
    </div>
  );
}
