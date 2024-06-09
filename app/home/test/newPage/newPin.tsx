'use client';
import React from 'react';

export const NewPinContainer = ({
  children,
  title,
  className,
  containerClassName,
}: {
  children: React.ReactNode;
  title?: string;
  className?: string;
  containerClassName?: string;
}) => {
  return (
    <div className={`${containerClassName} w-full h-full flex flex-col`}>
      <div className="flex-1 flex justify-start items-start rounded-2xl bg-black border border-white/[0.1] overflow-hidden">
        <div className={`${className} p-4 w-full h-full`}>{children}</div>
      </div>
      <PinPerspective title={title} />
    </div>
  );
};

export const PinPerspective = ({ title }: { title?: string }) => {
  return (
    <div>
      <div className="flex justify-center mt-4">
        <span className="text-white text-xs font-bold inline-block py-0.5">
          {title}
        </span>
      </div>
    </div>
  );
};
