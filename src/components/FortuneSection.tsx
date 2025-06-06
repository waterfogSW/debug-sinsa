'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import SectionCard from '@/common/components/SectionCard';
import { AppDispatch, RootState } from '@/store/store';
import {
  loadFortuneFromStorage,
  generateNewFortune,
  selectTodayFortune,
  selectFortuneIsLoading,
  selectFortuneError,
  selectFortuneLastFetchedDate,
  clearFortuneError
} from '@/store/features/fortune/fortuneSlice';

interface FortuneSectionProps {
  className?: string;
}

export default function FortuneSection({ className }: FortuneSectionProps) {
  const dispatch = useDispatch<AppDispatch>();
  const fortune = useSelector(selectTodayFortune);
  const isLoading = useSelector(selectFortuneIsLoading);
  const error = useSelector(selectFortuneError);
  const lastFetchedDate = useSelector(selectFortuneLastFetchedDate);

  useEffect(() => {
    dispatch(loadFortuneFromStorage());
  }, [dispatch]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (!isLoading && !fortune && lastFetchedDate !== today && !error) {
      dispatch(generateNewFortune());
    }
  }, [dispatch, isLoading, fortune, lastFetchedDate, error]);

  const handleGenerateNewFortune = () => {
    if (error) {
      dispatch(clearFortuneError());
    }
    dispatch(generateNewFortune());
  };

  return (
    <SectionCard title="오늘의 디버그 운세" className={`h-full ${className || ''}`}>
      <div className="flex flex-col items-center justify-center text-center flex-grow p-4">
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-lg text-gray-300">운세를 불러오는 중...</p>
          </div>
        )}
        {!isLoading && error && (
          <div className="text-red-400 my-4">
            <p>앗! 운세뽑기에 오류가 발생했어요.</p>
            <p className="text-sm">({error})</p>
          </div>
        )}
        {!isLoading && !error && fortune && (
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-lg text-accent font-semibold leading-relaxed break-keep"
          >
            {fortune}
          </motion.p>
        )}
        {!isLoading && !error && !fortune && (
            <p className="text-gray-400">오늘의 운세를 기다리고 있습니다...</p>
        )}
        
        {(!isLoading && (error || fortune)) && (
          <motion.button
            onClick={handleGenerateNewFortune}
            className="mt-4 px-6 py-2 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg shadow-md transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-charcoal focus:ring-accent"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {error ? '운세 다시 뽑기' : '다른 운세 보기'} 
          </motion.button>
        )}
      </div>
    </SectionCard>
  );
} 
