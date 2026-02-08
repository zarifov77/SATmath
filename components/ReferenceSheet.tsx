import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen } from 'lucide-react';

interface ReferenceSheetProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
  containerRef: React.RefObject<HTMLDivElement>;
}

const ReferenceSheet: React.FC<ReferenceSheetProps> = ({ isOpen, onClose, theme, containerRef }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          drag
          dragMomentum={false}
          dragConstraints={containerRef}
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          className="fixed z-[300] top-24 right-24 w-[480px] shadow-[0_30px_90px_-20px_rgba(0,0,0,0.6)] rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col bg-white dark:bg-gray-900 theme-transition"
        >
          {/* Header */}
          <div className="h-12 bg-[#1E1E1E] px-4 flex items-center justify-between shrink-0 text-white cursor-grab active:cursor-grabbing">
            <div className="flex items-center gap-3">
               <div className="bg-black/40 px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest border border-white/10">
                 Reference
               </div>
               <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Digital SAT Math</span>
            </div>
            <button onClick={onClose} className="p-1.5 hover:text-red-500 transition-all text-gray-500">
              <X size={18} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto bg-white p-8 max-h-[60vh]">
            <div className="relative">
              <img 
                src="https://your-image-url.com/reference-sheet.jpg" 
                alt="SAT Math Formula Sheet" 
                className="w-full h-auto rounded-xl shadow-sm border border-gray-100"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fb = e.currentTarget.parentElement?.querySelector('.fallback');
                  if (fb) fb.classList.remove('hidden');
                }}
              />
              <div className="fallback hidden flex flex-col items-center justify-center py-16 text-center space-y-8">
                 <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
                    <BookOpen size={32} className="text-[#0077C8]" />
                 </div>
                 <div className="space-y-3">
                   <p className="text-[11px] font-black text-[#0077C8] uppercase tracking-[0.3em]">Formula Reference Sheet</p>
                   <p className="text-gray-400 text-xs italic leading-relaxed">
                     The official Digital SAT Math Reference Sheet placeholder.
                   </p>
                 </div>
              </div>
            </div>
          </div>
          <div className="px-8 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
             <p className="text-[9px] font-black text-gray-400 uppercase text-center tracking-[0.2em]">Formulas & Guide Sheet</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReferenceSheet;