import React from 'react';
import { motion } from 'framer-motion';
import { PinContainer } from '@/components/ui/framerui/3d-pin';
import { BackgroundBeams } from '@/components/ui/framerui/background_beams';

export default function SkeletonPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center animated-gradient relative">
        <PinContainer title="">
          <BackgroundBeams />
          <motion.div
            layoutId="heroContainer"
            className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[20rem]"
          >
            <div className="max-w-xs !pb-2 !m-0 font-bold text-base text-slate-100 flex items-center justify-between">
              <div className="w-20 h-4 bg-slate-700 rounded-full animate-pulse"></div>
              <div className="w-10 h-4 bg-slate-700 rounded-full animate-pulse"></div>
            </div>
            <div className="text-base !m-0 !p-0 font-normal">
              <div className="w-40 h-4 bg-slate-700 rounded-full animate-pulse"></div>
            </div>
            <div className="mt-4">
              <div className="w-full h-4 bg-slate-700 rounded-full animate-pulse mb-2"></div>
              <div className="w-full h-4 bg-slate-700 rounded-full animate-pulse mb-2"></div>
              <div className="w-full h-4 bg-slate-700 rounded-full animate-pulse"></div>
            </div>
            <div className="w-full h-40 bg-slate-700 rounded-lg animate-pulse mt-4"></div>
          </motion.div>
        </PinContainer>
      </div>
    </div>
  );
}
