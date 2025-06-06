'use client';

import { motion } from 'framer-motion';
import { Stat } from '@/domain/Stat';
import { formatNumber } from '@/common/utils/formatters';
import CountUp from 'react-countup';
import { useState, useEffect, useRef } from 'react';

interface StatItemCardProps {
  stat: Stat;
}

export default function StatItemCard({ stat }: StatItemCardProps) {
  const [startCount, setStartCount] = useState(stat.value);
  const prevCountRef = useRef(stat.value);

  useEffect(() => {
    if (prevCountRef.current !== stat.value) {
      setStartCount(prevCountRef.current);
    }
    prevCountRef.current = stat.value;
  }, [stat.value]);

  return (
    <motion.div
      className="bg-dark-light/80 p-4 rounded-xl text-center border-2 border-primary/30 backdrop-blur-md transition-transform hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/30 h-full flex flex-col justify-center"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="text-3xl mb-1 block">{stat.icon}</span>
      <span className="text-3xl font-bold text-primary block mb-1">
        <CountUp start={startCount} end={stat.value} duration={1.5} separator="," />
      </span>
      <div className="text-xs text-gray-300">{stat.label}</div>
    </motion.div>
  );
} 
