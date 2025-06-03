'use client';

interface LanternProps {
  position: string;
  delay: number;
}

export default function Lantern({ position, delay }: LanternProps) {
  return (
    <div
      className={`fixed w-10 h-15 bg-gradient-to-br from-primary to-secondary rounded-t-lg rounded-b-[50%] shadow-lg animate-float z-2 ${position}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-5 h-4 bg-[#8b4513] rounded-lg" />
    </div>
  );
} 