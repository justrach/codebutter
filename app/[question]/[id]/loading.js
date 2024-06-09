'use client'
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/TextArea';
import { motion } from 'framer-motion';

export default function ClientSkeleton() {
  return (
    <div className="grid min-h-screen animated-gradient w-full grid-cols-[300px_1fr] gap-8 overflow-hidden p-8">
      <div className="flex flex-col gap-6">
        <div className="rounded-lg bg-gray-800 p-6 shadow-md animate-pulse">
          <h3 className="mb-4 text-xl font-medium text-gray-300">Problem</h3>
          <div className="prose prose-invert text-gray-400">
            <div className="h-24 bg-gray-700 rounded-md"></div>
          </div>
        </div>
        <div className="rounded-lg bg-gray-800 p-6 shadow-md animate-pulse">
          <h3 className="mb-4 text-xl font-medium text-gray-300">Test Cases</h3>
          <div className="grid gap-4">
            <div className="h-6 bg-gray-700 rounded-md"></div>
            <div className="h-6 bg-gray-700 rounded-md"></div>
            <div className="h-6 bg-gray-700 rounded-md"></div>
          </div>
        </div>
        <div className="rounded-lg bg-gray-800 p-6 shadow-md animate-pulse">
          <h3 className="mb-4 text-xl font-medium text-gray-300">Notes</h3>
          <Textarea
            placeholder="Loading..."
            className="h-24 resize-none rounded-md bg-gray-700 text-gray-400"
            disabled
          />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="relative rounded-sm overflow-guard bg-gray-800 shadow-md animate-pulse">
          <Card className="overflow-hidden">
            <motion.div layoutId="heroContainer">
              <div className="h-64 bg-gray-700 rounded-md"></div>
            </motion.div>
          </Card>
        </div>
        <div className="rounded-lg bg-gray-800 p-6 shadow-md flex flex-col gap-6 animate-pulse">
          <div className="flex justify-center items-center gap-4">
            <Button variant="ghost" size="icon" className="text-gray-400">
              <div className="h-5 w-5 bg-gray-700 rounded-full"></div>
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-400">
              <div className="h-5 w-5 bg-gray-700 rounded-full"></div>
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-400">
              <div className="h-5 w-5 bg-gray-700 rounded-full"></div>
            </Button>
          </div>
          <div>
            <h2 className="mb-4 text-xl font-medium text-gray-300">Output</h2>
            <div className="h-24 bg-gray-700 rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
