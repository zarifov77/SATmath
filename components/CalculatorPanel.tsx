
import React from 'react';
import { motion } from 'framer-motion';
import { X, GripVertical } from 'lucide-react';

interface CalculatorPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const CalculatorPanel: React.FC<CalculatorPanelProps> = ({ isOpen, onClose }) => {
  return (
    <div className="h-full w-full flex flex-col overflow-hidden theme-transition">
      <div className="h-14 flex items-center justify-between px-6 bg-[#1E1E1E] shrink-0 text-white">
        <div className="flex items-center gap-3">
           <GripVertical size={16} className="text-gray-500" />
           <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Desmos Graphing</span>
        </div>
        <button 
          onClick={onClose}
          className="p-1.5 hover:bg-white/10 rounded-full transition-all"
        >
          <X size={20} className="text-gray-400" />
        </button>
      </div>
      <div className="flex-1 bg-white relative">
        {/* Keeping iframe in DOM via conditional parent display/opacity in App.tsx */}
        <iframe
          src="https://www.desmos.com/calculator?lang=ru"
          className="w-full h-full border-none absolute inset-0"
          title="Desmos Calculator"
        />
      </div>
    </div>
  );
};

export default CalculatorPanel;
