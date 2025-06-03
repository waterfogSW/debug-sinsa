'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Stars from '@/components/Stars';
import Lantern from '@/components/Lantern';
import ShrineHeader from '@/components/ShrineHeader';
import SectionCard from '@/common/components/SectionCard';
import StatsSection from '@/components/StatsSection';
import OfferingsContent from '@/components/Offerings';
import MainFunctionsContent from '@/components/MainFunctions';
import FortuneSection from '@/components/FortuneSection';
import LiveProblems from '@/components/LiveProblems';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-dark via-dark-lighter to-dark-light relative overflow-x-hidden">
      <Stars />
      <Lantern position="left-1/4 top-1/5" delay={0} />
      <Lantern position="right-1/5 top-3/5" delay={2} />
      <Lantern position="left-1/2 top-1/3" delay={4} />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <ShrineHeader />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 items-stretch">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <SectionCard className="h-full">
                <StatsSection />
                <div className="my-6 border-b border-primary/20"></div>
                <OfferingsContent />
              </SectionCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                <div>
                  <SectionCard title="버그 퇴치 기원" className="h-full">
                    <MainFunctionsContent />
                  </SectionCard>
                </div>
                <div>
                  <FortuneSection className="h-full" />
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="lg:col-span-1"
          >
            <LiveProblems />
          </motion.div>
        </div>
      </div>
    </main>
  );
} 