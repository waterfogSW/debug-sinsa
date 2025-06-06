'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
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

  // 화면에 표시할 통계만 필터링 (🐞, ⛩️ 아이콘을 가진 통계)
  const displayedStats = allStats.filter(stat => stat.icon === '🐞' || stat.icon === '⛩️');

  useEffect(() => {
    if (statsStatus === 'idle') {
      dispatch(fetchStats());
    }
  }, [dispatch, statsStatus]);

  let content;
  if (statsStatus === 'loading') {
    // 초기 로딩 시 (displayedStats가 비어있을 때) 또는 업데이트 중일 때 구분 가능
    if (displayedStats.length > 0) { // 업데이트 중, 기존 데이터 표시
      content = (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch opacity-50 transition-opacity duration-300">
          {displayedStats.map((stat) => (
            <StatItemCard key={stat.id} stat={stat} />
          ))}
        </div>
      );
    } else { // 초기 로딩 중
      content = <div className="text-center py-10">통계 정보를 불러오는 중...</div>;
    }
  } else if (statsStatus === 'succeeded') {
    if (displayedStats.length === 0) {
      content = <div className="text-center py-10">표시할 통계 정보가 없습니다. (필터링 결과)</div>;
    } else {
      content = (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
          {displayedStats.map((stat) => (
            <StatItemCard key={stat.id} stat={stat} />
          ))}
        </div>
      );
    }
  } else if (statsStatus === 'failed') {
    content = <div className="text-center py-10 text-red-500">{statsError || '통계 정보를 불러오는데 실패했습니다.'}</div>;
  }

  return <>{content}</>;
} 
