'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store/store';
import {
  fetchStats,
  selectAllStats,
  selectStatsStatus,
  selectStatsError,
} from '@/store/features/stats/statsSlice';
import StatItemCard from './StatItemCard';

export default function StatsSection() {
  const dispatch = useDispatch<AppDispatch>();
  const allStats = useSelector(selectAllStats);
  const statsStatus = useSelector(selectStatsStatus);
  const statsError = useSelector(selectStatsError);

  const displayedStats = allStats.filter(stat => stat.icon === '🐞' || stat.icon === '⛩️');

  useEffect(() => {
    if (statsStatus === 'idle') {
      dispatch(fetchStats());
    }
  }, [dispatch, statsStatus]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch(fetchStats());
    }, 30000); // 30초마다 갱신

    return () => clearInterval(intervalId);
  }, [dispatch]);

  let content;
  if (statsStatus === 'loading' && displayedStats.length === 0) {
    content = <div className="text-center py-10">통계 정보를 불러오는 중...</div>;
  } else if (statsStatus === 'succeeded' || (statsStatus === 'loading' && displayedStats.length > 0)) {
    if (displayedStats.length === 0) {
      content = <div className="text-center py-10">표시할 통계 정보가 없습니다.</div>;
    } else {
      content = (
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch transition-opacity duration-300 ${statsStatus === 'loading' ? 'opacity-50' : ''}`}>
          {displayedStats.map((stat) => (
            <StatItemCard key={stat.id} stat={stat} />
          ))}
        </div>
      );
    }
  } else if (statsStatus === 'failed') {
    content = <div className="text-center py-10 text-red-500">{statsError || '통계 정보를 불러오는데 실패했습니다.'}</div>;
  } else {
    // 초기 idle 상태 또는 다른 예기치 않은 상태에 대한 fallback
    content = (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch opacity-50">
        {displayedStats.map((stat) => (
          <StatItemCard key={stat.id} stat={stat} />
        ))}
      </div>
    );
  }

  return <>{content}</>;
} 
