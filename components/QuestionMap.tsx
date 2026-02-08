
import React from 'react';
import { Bookmark } from 'lucide-react';
import { Question, Answers, ReviewFlags } from '../types.ts';
import { motion, AnimatePresence } from 'framer-motion';

interface QuestionMapProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  currentQuestionIndex: number;
  answers: Answers;
  reviewFlags: ReviewFlags;
  onSelectQuestion: (index: number) => void;
  theme: 'light' | 'dark';
}

const QuestionMap: React.FC<QuestionMapProps> = ({
  isOpen,
  onClose,
  questions,
  currentQuestionIndex,
  answers,
  reviewFlags,
  onSelectQuestion,
  theme
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-end justify-center bg-black/70 backdrop-blur-md p-6" onClick={onClose}>
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            className="w-full max-w-2xl rounded-[3rem] shadow-2xl p-10 pb-12 mb-20 border theme-transition"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">Navigation — Questions Grid</h2>
              <button onClick={onClose} className="text-[10px] font-black uppercase text-[#0077C8] hover:text-[#3B82F6] tracking-widest transition-colors">CLOSE</button>
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-11 gap-4 overflow-y-auto p-1 max-h-[40vh]">
              {questions.map((q, idx) => {
                const isAnswered = answers[q.id] !== undefined;
                const isFlagged = reviewFlags[q.id];
                const isCurrent = idx === currentQuestionIndex;

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      onSelectQuestion(idx);
                      onClose();
                    }}
                    className={`
                      relative h-14 w-14 rounded-2xl border-2 flex flex-col items-center justify-center transition-all theme-transition
                      ${isCurrent 
                        ? 'border-[#0077C8] bg-[#0077C8]/20 text-blue-600 dark:text-white' 
                        : 'border-transparent bg-gray-100 dark:bg-black/20 text-gray-500 hover:border-blue-500/50'}
                    `}
                  >
                    <span className="text-xs font-black">{idx + 1}</span>
                    <div className="flex gap-1 absolute bottom-2">
                       {isAnswered && <div className="w-1.5 h-1.5 bg-[#0077C8] rounded-full" />}
                       {isFlagged && <Bookmark size={10} className="text-red-500" fill="currentColor" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap gap-10 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-[#0077C8] rounded bg-[#0077C8]/20" />
                <span>Active</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 border border-gray-300 dark:border-gray-700 rounded flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-[#0077C8] rounded-full" />
                </div>
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-3">
                <Bookmark size={14} className="text-red-500" fill="currentColor" />
                <span>Flagged</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default QuestionMap;
