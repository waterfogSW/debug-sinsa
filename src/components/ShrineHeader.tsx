'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function ShrineHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="text-center mb-12 p-10 bg-dark-lighter/80 rounded-2xl backdrop-blur-md border-2 border-primary/30 shadow-lg shadow-primary/20 relative">
        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute top-4 right-4 text-xs text-primary/70 hover:text-accent transition-colors duration-200"
        >
          건립 기원
        </button>
        <h1 className="text-5xl text-primary mb-4 animate-glow">
          🏮 디버그 신사 🏮
        </h1>
        <p className="text-gray-400 text-sm mb-4">(デバッグ神社)</p>
        <p className="text-gray-200 text-lg mb-2">모든 버그를 물리치는 신성한 성지</p>
        <p className="text-gray-400">여기서 당신의 코드가 구원받을 것입니다</p>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-dark-light p-6 rounded-xl shadow-2xl w-full max-w-lg relative border border-primary/30"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                aria-label="Close modal"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>

              <h2 className="text-2xl font-bold text-primary mb-4">디버그 신사 건립 기원</h2>
              <div className="space-y-4 text-gray-200">
                <p className="leading-relaxed">
                  원인불명의 버그로 고민하던 말레이시아인 엔지니어가<br />
                  멍하니 완충재에 본드를 붙여 뭔가 만들고 있었다.
                </p>
                <p className="leading-relaxed">
                  '뭐하는 거야?'라고 물어봤더니<br />
                  '디버그 신사입니다'라고.
                </p>
                <p className="leading-relaxed">
                  그리고 디버그 신사가 건립됨과 동시에 버그는 사라졌다.<br />
                  정체가 뭐냐 디버그 신사.
                </p>
                <div className="pt-4 border-t border-primary/20">
                  <p className="text-sm text-gray-400">
                    한국 신사 건립자: <a href="https://github.com/waterfogSW" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-accent transition-colors duration-200">@waterfogSW</a>
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 