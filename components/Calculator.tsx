
import React from 'react';
import { X, GripHorizontal } from 'lucide-react';

interface CalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

const Calculator: React.FC<CalculatorProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 pointer-events-none">
      <div 
        className="w-[600px] h-[500px] bg-white rounded-lg shadow-2xl flex flex-col pointer-events-auto border border-gray-200 overflow-hidden"
        style={{ position: 'relative' }}
      >
        {/* Header/Draggable Handle */}
        <div className="bg-gray-100 p-2 flex items-center justify-between border-b cursor-move">
          <div className="flex items-center gap-2 text-gray-600 font-medium text-sm pl-2">
            <GripHorizontal size={16} />
            Calculator
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>
        
        {/* Desmos Iframe */}
        <div className="flex-1 bg-white">
          <iframe
            src="https://www.desmos.com/calculator?lang=ru"
            className="w-full h-full border-none"
            title="Desmos Calculator"
          />
        </div>
      </div>
    </div>
  );
};

export default Calculator;
