'use client';

import { motion } from 'framer-motion';
import { Problem } from '@/domain/Problem';
import { formatTimestamp } from '@/common/utils/formatters';

interface ProblemItemCardProps {
  problem: Problem;
  onOpenReplies?: (problem: Problem) => void;
  hasReplies?: boolean;
}

const CONTENT_PREVIEW_LENGTH = 50;

const ProblemItemCard: React.FC<ProblemItemCardProps> = ({ problem, onOpenReplies, hasReplies }) => {
  const shouldShowEllipsis = problem.content.length > CONTENT_PREVIEW_LENGTH;
  const previewContent = shouldShowEllipsis 
    ? `${problem.content.substring(0, CONTENT_PREVIEW_LENGTH)}...`
    : problem.content;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-dark-lighter/50 p-4 rounded-lg border border-primary/20 cursor-pointer hover:border-primary/50 transition-colors"
      onClick={() => onOpenReplies && onOpenReplies(problem)}
    >
      <div className="text-gray-200 mb-2 break-all whitespace-pre-wrap">
        {previewContent}
        {shouldShowEllipsis && <span className="text-primary/70 ml-1">(더보기)</span>}
      </div>
      <div className="flex justify-between items-center text-sm text-gray-400">
        <div className="flex items-center">
          <span>{problem.author}</span>
          {hasReplies && <span className="ml-2 text-xl">⛩️</span>}
        </div>
        <span>{formatTimestamp(problem.timestamp)}</span>
      </div>
    </motion.div>
  );
};

export default ProblemItemCard; 
