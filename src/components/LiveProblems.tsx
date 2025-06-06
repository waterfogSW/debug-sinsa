'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Problem } from '@/domain/Problem';
import { AppDispatch, RootState } from '@/store/store';
import {
  fetchProblems,
  selectAllProblems,
  selectProblemsFetchStatus,
  selectProblemsFetchError
} from '@/store/features/problems/problemsSlice';
import SectionCard from '@/common/components/SectionCard';
import ProblemItemCard from '@/components/ProblemItemCard';
import ReplyModal from '@/components/ReplyModal';

const PROBLEMS_LIMIT = 50;

export default function LiveProblems() {
  const dispatch = useDispatch<AppDispatch>();
  const problems = useSelector(selectAllProblems);
  const fetchStatus = useSelector(selectProblemsFetchStatus);
  const fetchError = useSelector(selectProblemsFetchError);
  const hasMore = useSelector((state: RootState) => state.problems.hasMore);
  const nextCursor = useSelector((state: RootState) => state.problems.nextCursor);

  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);

  useEffect(() => {
    if (fetchStatus === 'idle') {
      dispatch(fetchProblems({ limit: 10 }));
    }
  }, [dispatch, fetchStatus]);

  // 주기적인 데이터 갱신을 위한 useEffect
  useEffect(() => {
    const intervalId = setInterval(() => {
      // 새로운 고민만 가져오도록 첫 페이지를 요청
      dispatch(fetchProblems({ limit: 10 }));
    }, 30000); // 30초마다 갱신

    return () => clearInterval(intervalId);
  }, [dispatch]);

  const handleProblemClick = (problem: Problem) => {
    setSelectedProblem(problem);
  };

  const handleCloseModal = () => {
    setSelectedProblem(null);
  };

  const handleLoadMore = () => {
    if (fetchStatus !== 'loading' && hasMore) {
      dispatch(fetchProblems({ limit: PROBLEMS_LIMIT, cursor: nextCursor }));
    }
  };

  let content;
  if (fetchStatus === 'loading' && problems.length === 0) {
    content = <p className="text-center text-gray-400 py-4">고민 목록을 불러오는 중...</p>;
  } else if (fetchStatus === 'failed') {
    content = <p className="text-center text-red-500 py-4">오류: {fetchError || '고민 목록을 불러오는데 실패했습니다.'}</p>;
  } else if (problems.length === 0) {
    content = <p className="text-center text-gray-400 py-4">아직 공유된 고민이 없습니다.</p>;
  } else {
    content = (
      <ul className="space-y-3">
        <AnimatePresence>
          {problems.map((problem, index) => (
            <motion.li
              key={problem.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
              layout
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <ProblemItemCard 
                problem={problem} 
                onOpenReplies={handleProblemClick} 
                hasReplies={(problem.replies?.[0]?.count || 0) > 0}
              />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    );
  }

  return (
    <SectionCard title="실시간 개발자들의 고민" className="h-full max-h-[80vh] flex flex-col">
      <div 
        className={`flex-grow overflow-y-auto pr-1 space-y-4 custom-scrollbar ${fetchStatus === 'loading' && problems.length > 0 ? 'opacity-70' : ''}`}
      >
        {content}
        {hasMore && (
          <div className="flex justify-center mt-4">
            <button
              onClick={handleLoadMore}
              disabled={fetchStatus === 'loading'}
              className="px-4 py-2 bg-primary/80 text-white rounded-md hover:bg-primary disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {fetchStatus === 'loading' ? '불러오는 중...' : '더 보기'}
            </button>
          </div>
        )}
      </div>
      {selectedProblem && (
        <ReplyModal 
          problem={selectedProblem} 
          isOpen={!!selectedProblem}
          onClose={handleCloseModal} 
        />
      )}
    </SectionCard>
  );
} 
