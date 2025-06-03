'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import {
  createProblem,
  selectProblemCreateStatus,
  selectProblemCreateError
} from '@/store/features/problems/problemsSlice';
// import { createProblem as createProblemAPI } from '@/services/api'; // Redux thunk 사용으로 대체

const generateRandomGuestName = () => {
  const randomNumber = Math.floor(Math.random() * 9000) + 1000;
  return `익명의 나그네 #${randomNumber}`;
};

const NICKNAME_MAX_LENGTH = 20;
const PROBLEM_MAX_LENGTH = 200;

export default function MainFunctionsContent() {
  const dispatch = useDispatch<AppDispatch>();
  const [problemText, setProblemText] = useState('');
  const [authorName, setAuthorName] = useState(generateRandomGuestName());

  const createStatus = useSelector(selectProblemCreateStatus);
  const createError = useSelector(selectProblemCreateError);

  const isSubmitting = createStatus === 'loading';

  const handleProblemTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= PROBLEM_MAX_LENGTH) {
      setProblemText(e.target.value);
    }
  };

  const handleAuthorNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= NICKNAME_MAX_LENGTH) {
      setAuthorName(e.target.value);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!problemText.trim()) {
      alert('고민 내용을 입력해주세요.');
      return;
    }
    const authorToSubmit = authorName.trim() === '' ? generateRandomGuestName() : authorName;

    try {
      await dispatch(createProblem({ content: problemText, author: authorToSubmit })).unwrap();
      setProblemText('');
    } catch (error) {
      console.error('Error creating problem via Redux:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <div className="flex justify-between items-center mb-1">
            <label htmlFor="problemText" className="block text-sm font-medium text-gray-300">
            고민 내용 (최대 {PROBLEM_MAX_LENGTH}자)
            </label>
            <span className={`text-xs ${problemText.length > PROBLEM_MAX_LENGTH - 20 ? (problemText.length > PROBLEM_MAX_LENGTH ? 'text-red-500' : 'text-yellow-500') : 'text-gray-400'}`}>
                {problemText.length}/{PROBLEM_MAX_LENGTH}
            </span>
        </div>
        <textarea
          id="problemText"
          value={problemText}
          onChange={handleProblemTextChange}
          placeholder="오늘 당신을 괴롭히는 버그는 무엇인가요? 신령님께 상세히 보고하세요..."
          rows={4}
          maxLength={PROBLEM_MAX_LENGTH}
          className="w-full p-3 bg-dark-lighter/70 border border-primary/30 rounded-md focus:ring-2 focus:ring-accent focus:border-transparent outline-none placeholder-gray-500 text-gray-200 transition-all duration-150 ease-in-out shadow-sm"
          disabled={isSubmitting}
          required
        />
      </div>
      <div>
        <label htmlFor="authorName" className="block text-sm font-medium text-gray-300 mb-1">
          닉네임 (비워두면 랜덤) - 최대 {NICKNAME_MAX_LENGTH}자
        </label>
        <input
          type="text"
          id="authorName"
          value={authorName}
          onChange={handleAuthorNameChange}
          placeholder={`예: 익명의 나그네 #1234 (최대 ${NICKNAME_MAX_LENGTH}자)`}
          maxLength={NICKNAME_MAX_LENGTH}
          className="w-full p-3 bg-dark-lighter/70 border border-primary/30 rounded-md focus:ring-2 focus:ring-accent focus:border-transparent outline-none placeholder-gray-500 text-gray-200 transition-all duration-150 ease-in-out shadow-sm text-sm"
        />
      </div>
      <div className="flex flex-col items-center space-y-2 pt-2">
        <motion.button
          type="submit"
          disabled={isSubmitting || !problemText.trim() || problemText.length > PROBLEM_MAX_LENGTH || authorName.length > NICKNAME_MAX_LENGTH}
          className="w-full px-6 py-3 bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white font-semibold rounded-lg shadow-md transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark focus:ring-accent"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              처리 중...
            </span>
          ) : (
            '신단에 버그 퇴치 기원 올리기'
          )}
        </motion.button>
        {createStatus === 'failed' && createError && (
          <p className="text-sm text-red-400">에러: {createError}</p>
        )}
      </div>
    </form>
  );
} 