import React from 'react';
import { cn } from '../../../components/ui';

export const AutoScrollSlider = ({
  children,
  className,
  speed = 0.5,
  isPaused,
}: {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  isPaused: boolean;
}) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) {return;}

    let animationId: number;
    let position = scroller.scrollLeft;

    const step = () => {
      if (!isPaused && scroller) {
        position += speed;
        if (position >= scroller.scrollWidth / 3) {
          position = 0;
        }
        scroller.scrollLeft = position;
      } else if (scroller) {
        position = scroller.scrollLeft;
      }
      animationId = requestAnimationFrame(step);
    };

    animationId = requestAnimationFrame(step);
    return () =>{  cancelAnimationFrame(animationId); };
  }, [isPaused, speed]);

  return (
    <div
      ref={scrollRef}
      className={cn('flex overflow-x-auto cursor-grab active:cursor-grabbing touch-pan-x', className)}
      style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
    >
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
      <div className="flex shrink-0 gap-16 items-center px-4">{children}</div>
      <div className="flex shrink-0 gap-16 items-center px-4">{children}</div>
      <div className="flex shrink-0 gap-16 items-center px-4">{children}</div>
    </div>
  );
};
