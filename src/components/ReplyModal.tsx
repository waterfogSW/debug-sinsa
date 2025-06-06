'use client';

import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { PaperAirplaneIcon } from '@heroicons/react/20/solid';
import { Problem } from '@/domain/Problem';
import { Reply } from '@/domain/Reply';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import {
  fetchReplies,
  createReply,
  selectRepliesByProblemId,
  selectRepliesFetchStatus,
  selectRepliesFetchError,
  selectRepliesCreateStatus,
  selectRepliesCreateError,
  resetCreateStatus,
} from '@/store/features/replies/repliesSlice';
import { formatTimestamp } from '@/common/utils/formatters';
import Portal from '@/common/components/Portal';

interface ReplyModalProps {
  problem: Problem;
  isOpen: boolean;
  onClose: () => void;
}

const REPLY_MAX_LENGTH = 200;

export default function ReplyModal({ problem, isOpen, onClose }: ReplyModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [replyText, setReplyText] = useState('');

  const replies = useSelector((state: RootState) => selectRepliesByProblemId(state, problem.id));
  const fetchStatus = useSelector(selectRepliesFetchStatus);
  const fetchError = useSelector(selectRepliesFetchError);
  const createStatus = useSelector(selectRepliesCreateStatus);
  const createError = useSelector(selectRepliesCreateError);

  const isLoadingReplies = fetchStatus === 'loading';
  const isSubmittingReply = createStatus === 'loading';

  useEffect(() => {
    if (isOpen && problem?.id) {
      dispatch(fetchReplies(problem.id));
    }
    return () => {
      if (!isOpen) {
        dispatch(resetCreateStatus());
      }
    };
  }, [isOpen, problem?.id, dispatch]);
  
  useEffect(() => {
    if (createStatus === 'succeeded') {
      setReplyText('');
    }
  }, [createStatus, dispatch]);

  const handleReplyTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= REPLY_MAX_LENGTH) {
      setReplyText(e.target.value);
    }
  };

  const handleReplySubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !problem?.id || replyText.length > REPLY_MAX_LENGTH) return;

    try {
      await dispatch(createReply({ problemId: problem.id, content: replyText })).unwrap();
    } catch (err) {
      console.error("Failed to submit reply:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <Portal>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-dark-light p-6 rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col relative border border-primary/30"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
              aria-label="Close modal"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            <h2 className="text-2xl font-bold text-primary mb-1">{problem.author}님의 고민</h2>
            <p className="text-sm text-gray-400 mb-4">{formatTimestamp(problem.timestamp)}</p>
            <div className="bg-dark-lighter p-3 rounded-md mb-4">
              <p className="text-gray-200 whitespace-pre-wrap break-words">{problem.content}</p>
            </div>

            <h3 className="text-lg font-semibold text-accent mb-3">신령님의 답변들</h3>
            <div className="flex-grow overflow-y-auto mb-4 pr-2 space-y-3 scrollbar-thin scrollbar-thumb-primary/40 scrollbar-track-dark-light/20">
              {isLoadingReplies && <p className="text-gray-400 text-center">답변을 불러오는 중...</p>}
              {!isLoadingReplies && fetchError && <p className="text-red-400 text-center">오류: {fetchError}</p>}
              {!isLoadingReplies && !fetchError && replies.length === 0 && (
                <p className="text-gray-400 text-center py-4">아직 답변이 없습니다. 첫 답변을 남겨주세요!</p>
              )}
              {replies.map((reply) => (
                <motion.div 
                  key={reply.id} 
                  className="bg-dark-light p-3 rounded-lg shadow"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-semibold text-accent">{reply.author}</p>
                    <p className="text-xs text-gray-500">{formatTimestamp(reply.timestamp)}</p>
                  </div>
                  <p className="text-gray-300 text-sm whitespace-pre-wrap break-words">{reply.content}</p>
                </motion.div>
              ))}
            </div>

            <form onSubmit={handleReplySubmit} className="mt-auto pt-4 border-t border-primary/20 space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                    <label htmlFor="replyText" className="block text-sm font-medium text-gray-300">
                        답변 작성 (최대 {REPLY_MAX_LENGTH}자)
                    </label>
                    <span className={`text-xs ${replyText.length > REPLY_MAX_LENGTH - 20 ? (replyText.length > REPLY_MAX_LENGTH ? 'text-red-500' : 'text-yellow-500') : 'text-gray-400'}`}>
                        {replyText.length}/{REPLY_MAX_LENGTH}
                    </span>
                </div>
                <textarea
                  id="replyText"
                  value={replyText}
                  onChange={handleReplyTextChange}
                  placeholder="신령님의 지혜로운 답변을 남겨주세요..."
                  rows={3}
                  maxLength={REPLY_MAX_LENGTH}
                  className="w-full p-2 bg-dark-lighter/70 border border-primary/30 rounded-md focus:ring-1 focus:ring-accent focus:border-transparent outline-none placeholder-gray-500 text-gray-200 text-sm transition-colors resize-none shadow-sm"
                  disabled={isSubmittingReply}
                />
              </div>
              <motion.button
                type="submit"
                disabled={isSubmittingReply || !replyText.trim() || replyText.length > REPLY_MAX_LENGTH}
                className="w-full flex items-center justify-center px-4 py-3 bg-accent hover:bg-opacity-80 text-primary font-semibold rounded-lg disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-charcoal focus:ring-primary"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                aria-label="Submit reply"
              >
                {isSubmittingReply ? (
                  <svg className="animate-spin h-5 w-5 mr-2 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <PaperAirplaneIcon className="h-5 w-5 mr-2 transform rotate-45 text-primary" />
                )}
                {isSubmittingReply ? '등록 중...' : '답변 등록'}
              </motion.button>
              {createStatus === 'failed' && createError && (
                <p className="text-xs text-red-400 mt-1 text-center">답변 등록 실패: {createError}</p>
              )}
            </form>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </Portal>
  );
} 
