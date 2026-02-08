
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Added Clock to the imports from lucide-react
import { 
  TrendingUp,
  Sparkles,
  Sun,
  Moon,
  ChevronRight,
  RotateCcw,
  X,
  Target,
  Clock
} from 'lucide-react';
import { Question, Answers } from '../types.ts';
import MathText from './MathText.tsx';

interface ResultsDashboardProps {
  questions: Question[];
  answers: Answers;
  onRestart: () => void;
  theme: 'light' | 'dark';
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ questions, answers, onRestart, theme: initialTheme }) => {
  const [localTheme, setLocalTheme] = useState<'light' | 'dark'>(initialTheme);
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);

  const toggleLocalTheme = () => {
    const next = localTheme === 'light' ? 'dark' : 'light';
    setLocalTheme(next);
    const root = window.document.documentElement;
    if (next === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  };

  const correctAnswers = useMemo(() => 
    questions.filter(q => answers[q.id] === q.correctAnswer),
    [questions, answers]
  );

  const total = questions.length;
  const rawScaled = 200 + (correctAnswers.length / total) * 600;
  const scaledScore = Math.round(rawScaled / 10) * 10;

  const getFeedback = (score: number) => {
    if (score >= 780) return "Exceptional mastery. Your logic and accuracy are in the top tier of candidates.";
    if (score >= 700) return "Outstanding performance. A few more sessions on timing and you'll hit a perfect 800.";
    if (score >= 600) return "Great start! Focusing on Module 2 advanced algebra will push you into the 700s.";
    if (score >= 500) return "Solid baseline. Identifying 'Advanced Math' gaps will yield your largest gains.";
    return "Consistent practice with timed modules will help sharpen your accuracy and confidence.";
  };

  const selectedQuestion = questions.find(q => q.id === selectedQuestionId);

  const isLight = localTheme === 'light';
  const bgMain = isLight ? '#F9FAFB' : '#0F1117';
  const bgCard = isLight ? '#FFFFFF' : '#1A1D24';
  const textPrimary = isLight ? '#1E293B' : '#F1F5F9';
  const textSecondary = isLight ? '#64748B' : '#94A3B8';
  const borderColor = isLight ? '#E2E8F0' : '#2D2E35';
  const scoreColor = isLight ? '#0F172A' : '#FFFFFF';

  return (
    <div 
      className="h-screen w-screen flex flex-col font-sans overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: bgMain, color: textPrimary }}
    >
      {/* Header Area */}
      <header className="h-20 shrink-0 px-10 flex items-center justify-between border-b sticky top-0 z-40" style={{ borderColor, backgroundColor: bgCard }}>
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <TrendingUp size={20} className="text-[#0077C8]" />
            </div>
            <span className="text-sm font-black tracking-tight uppercase">Analytics Dashboard</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-700">
              <Clock size={14} className="opacity-70" />
              <span>Section 1: 17.46m</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-700">
              <Clock size={14} className="opacity-70" />
              <span>Section 2: 15.12m</span>
            </div>
          </div>
        </div>

        <button 
          onClick={toggleLocalTheme}
          className="p-3 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-all active:scale-90 border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
        >
          {isLight ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-10 py-12 space-y-12">
          
          {/* Summary Section Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Score Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-1 p-10 rounded-[2.5rem] shadow-sm border flex flex-col items-center justify-center text-center group hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500"
              style={{ backgroundColor: bgCard, borderColor }}
            >
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 opacity-40">Math Section Score</h4>
              <div className="text-[9rem] font-black tracking-tighter leading-none" style={{ color: scoreColor }}>
                {scaledScore}
              </div>
              <div className="mt-8 flex items-center gap-3 px-6 py-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-500/20">
                <Target size={16} />
                <span className="text-xs font-black uppercase tracking-widest">{correctAnswers.length} / {total} Correct</span>
              </div>
            </motion.div>

            {/* Mastery Glassmorphic Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 p-12 rounded-[2.5rem] relative overflow-hidden flex flex-col justify-center border transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10"
              style={{ 
                backgroundColor: isLight ? 'rgba(255, 255, 255, 0.7)' : 'rgba(26, 29, 36, 0.7)',
                backdropFilter: 'blur(30px)',
                WebkitBackdropFilter: 'blur(30px)',
                borderColor: isLight ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.2)'
              }}
            >
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#0077C8]/5 to-transparent pointer-events-none" />
              
              <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-3 text-[#0077C8]">
                  <Sparkles size={24} />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Performance Insight</span>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-3xl font-black leading-tight max-w-xl">
                    {getFeedback(scaledScore)}
                  </h3>
                  <p className="text-sm opacity-60 max-w-lg font-medium leading-relaxed">
                    Based on your results, you're excelling in {correctAnswers.filter(q => q.domain === 'Algebra').length > 5 ? 'Algebra' : 'standard arithmetic'}. Consider reviewing 'Advanced Math' concepts for a higher difficulty curve.
                  </p>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={onRestart}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-[#0077C8] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/30 hover:bg-[#005A9C] hover:scale-105 transition-all active:scale-95"
                  >
                    <RotateCcw size={18} />
                    Retake Section
                  </button>
                </div>
              </div>

              {/* Decorative Circle */}
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
            </motion.div>
          </div>

          {/* Question Review Stack */}
          <div className="space-y-8 pb-20">
            <div className="flex items-center justify-between border-b pb-6" style={{ borderColor }}>
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Section Item Review</h4>
              <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest opacity-60">
                <span>{total} Total Items</span>
              </div>
            </div>

            <div className="space-y-6">
              {questions.map((q, idx) => {
                const userAnswer = answers[q.id];
                const isCorrect = userAnswer === q.correctAnswer;
                const isUnanswered = !userAnswer;

                return (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.03 * idx }}
                    className="group p-10 rounded-3xl border shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 cursor-pointer transition-all duration-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600"
                    style={{ backgroundColor: bgCard, borderColor }}
                    onClick={() => setSelectedQuestionId(q.id)}
                  >
                    <div className="flex items-center gap-8 w-full">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner transition-colors ${
                        isCorrect ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' : 
                        isUnanswered ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400' : 
                        'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400'
                      }`}>
                        {idx + 1}
                      </div>
                      
                      <div className="space-y-3 flex-1 min-w-0 pr-4">
                        <div className="flex items-center gap-4 flex-wrap">
                          {isCorrect ? (
                            <span className="text-[9px] font-black uppercase text-emerald-500 tracking-[0.2em] px-3 py-1 bg-emerald-500/5 rounded-full border border-emerald-500/10">Correct</span>
                          ) : isUnanswered ? (
                            <span className="text-[9px] font-black uppercase text-amber-600 dark:text-amber-400 tracking-[0.2em] px-3 py-1 bg-amber-500/5 rounded-full border border-amber-500/10">Omitted</span>
                          ) : (
                            <span className="text-[9px] font-black uppercase text-rose-500 tracking-[0.2em] px-3 py-1 bg-rose-500/5 rounded-full border border-rose-500/10">Incorrect</span>
                          )}
                          <span className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">• {q.domain}</span>
                        </div>
                        <div className="text-base font-bold truncate opacity-80 leading-relaxed max-w-2xl">
                          <MathText text={q.text} />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-10 shrink-0">
                      <div className="flex items-center gap-12">
                        {!isUnanswered && (
                          <div className="text-center">
                            <p className="text-[8px] font-black uppercase opacity-30 mb-2 tracking-widest">Your Choice</p>
                            <div className={`text-sm font-black ${isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
                              <MathText text={userAnswer} />
                            </div>
                          </div>
                        )}
                        <div className="text-center">
                          <p className="text-[8px] font-black uppercase opacity-30 mb-2 tracking-widest">Key Answer</p>
                          <div className="text-sm font-black text-[#0077C8]">
                            <MathText text={q.correctAnswer} />
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-slate-300 dark:text-slate-600 pr-2">
                        <ChevronRight size={24} />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Modal Overlay */}
      <AnimatePresence>
        {selectedQuestionId !== null && selectedQuestion && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-5xl h-[85vh] rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden border transition-all duration-300"
              style={{ backgroundColor: bgCard, borderColor }}
            >
              <div className="h-20 shrink-0 flex items-center justify-between px-12 border-b" style={{ borderColor }}>
                <div className="flex items-center gap-6">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Item Detail — Question {questions.indexOf(selectedQuestion) + 1}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                  <span className="text-xs font-black text-[#0077C8] uppercase tracking-widest">{selectedQuestion.domain}</span>
                </div>
                <button 
                  onClick={() => setSelectedQuestionId(null)}
                  className="p-3 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
                <div className="flex-1 p-16 overflow-y-auto border-r border-slate-100 dark:border-slate-800">
                  <div className="max-w-xl mx-auto space-y-12">
                    <div className="space-y-6">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">Problem Statement</h4>
                      <div className="text-3xl leading-snug font-bold">
                        <MathText text={selectedQuestion.text} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-[420px] p-16 overflow-y-auto bg-slate-50/50 dark:bg-black/20">
                  <div className="space-y-10">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">Option Evaluation</h4>
                    <div className="space-y-4">
                      {selectedQuestion.options.map((option, idx) => {
                        const isCorrect = option === selectedQuestion.correctAnswer;
                        const isChosen = answers[selectedQuestion.id] === option;
                        const letter = String.fromCharCode(65 + idx);
                        
                        // Default Base Styles: Force White background and Slate text for maximum contrast
                        let optionBaseStyles = "bg-white text-slate-900 border-slate-200";
                        let letterStyles = "bg-slate-100 text-slate-400";
                        
                        if (isCorrect) {
                          optionBaseStyles = "bg-green-100 text-green-900 border-green-500 shadow-sm shadow-green-200/50";
                          letterStyles = "bg-green-600 text-white";
                        } else if (isChosen) {
                          optionBaseStyles = "bg-red-100 text-red-900 border-red-500 shadow-sm shadow-red-200/50";
                          letterStyles = "bg-red-600 text-white";
                        }
                        
                        return (
                          <div 
                            key={idx}
                            className={`p-6 rounded-[1.5rem] border-2 transition-all flex items-center gap-6 shadow-sm ${optionBaseStyles}`}
                          >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-black text-sm shadow-md transition-all ${letterStyles}`}>
                              {letter}
                            </div>
                            <div className="font-black text-xl">
                              <MathText text={option} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResultsDashboard;
