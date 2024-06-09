'use client';
import { useRouter } from 'next/navigation';
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { NewPinContainer } from './newPin';
import dynamic from 'next/dynamic';
import { Card } from '@/components/ui/card';

const TextEditor = dynamic(() => import('@/components/editor'), {
  ssr: false,
});

export default function NewPage() {
  const router = useRouter();
  const editorRef = useRef<{ getValue: () => string | undefined }>(null);

  return (
    <div className="min-h-screen flex flex-col p-8 items-center justify-center animated-gradient">
      <motion.div
        layoutId="heroContainer"
        className="w-full h-full flex flex-col"
      >
        <NewPinContainer title="">
          <Card className="flex-1 overflow-hidden">
            <TextEditor ref={editorRef} language="python" />
          </Card>
        </NewPinContainer>
      </motion.div>
      {/* <Link
        href="/home/test"
        className="absolute bottom-4 bg-white text-black px-4 py-2 rounded-md"
      >
        Go Back
      </Link> */}
    </div>
  );
}
