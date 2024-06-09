'use client';
import { TypewriterEffect } from '../ui/type_writer_effect';

export function TypewriterEffectDemo() {
  const words = [
    {
      text: 'Coding',
    },
    {
      text: 'that',
    },
    {
      text: 'learns',
    },
    {
      text: 'your',
    },
    {
      text: 'Style.',
      className: 'text-[#dfc7a7] dark:text-brown-500',
    },
  ];

  return (
  <div className='hidden lg:block'>
    <div className="flex flex-col items-center justify-center md:min-h-screen py-12 md:py-24">
      <p className="text-neutral-600 dark:text-neutral-200 text-base mb-6">
        OMNI Love
      </p>
      <TypewriterEffect words={words} />
      <div className="flex flex-col space-y-4 mt-8 w-full max-w-xs">
        <button className="w-full h-12 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm">
          Join now
        </button>
        <button className="w-full h-12 rounded-xl bg-white text-black border border-black text-sm">
          Signup
        </button>
      </div>
    </div>
      </div>
  );
}
