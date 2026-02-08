import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { 
  Calculator as CalculatorIcon, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  EyeOff, 
  Bookmark,
  Menu,
  Timer as TimerIcon,
  Sparkles,
  BookOpen,
  Strikethrough as StrikethroughIcon,
  Sun,
  Moon
} from 'lucide-react';
import { QUESTIONS, MODULE_TIME } from './constants.tsx';
import { ExamState } from './types.ts';
import CalculatorPanel from './components/CalculatorPanel.tsx';
import QuestionMap from './components/QuestionMap.tsx';
import ResultsDashboard from './components/ResultsDashboard.tsx';
import ReferenceSheet from './components/ReferenceSheet.tsx';
import MathText from './components/MathText.tsx';

const BREAK_DURATION = 15; 

const App: React.FC = () => {
  // REQUIREMENT: Default to White Theme on entry
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [state, setState] = useState<ExamState>({
    view: 'exam',
    currentModule: 1,
    currentQuestionIndex: 0,
    answers: {},
    reviewFlags: {},
    strikethroughs: {},
    timer: MODULE_TIME,
    isTimerVisible: true,
    breakTimer: BREAK_DURATION,
  });

  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isReferenceOpen, setIsReferenceOpen] = useState(false);
  const [isEliminatorActive, setIsEliminatorActive] = useState(false);
  const mainContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [theme]);

  const currentQuestions = useMemo(() => 
    QUESTIONS.filter(q => q.module === state.currentModule),
    [state.currentModule]
  );
  
  const currentQuestion = currentQuestions[state.currentQuestionIndex];

  useEffect(() => {
    if (state.view !== 'exam' && state.view !== 'review') return;
    
    const interval = setInterval(() => {
      setState(prev => {
        if (prev.timer <= 0) return { ...prev, view: 'review' };
        return { ...prev, timer: prev.timer - 1 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [state.view]);

  useEffect(() => {
    if (state.view !== 'break') return;

    const interval = setInterval(() => {
      setState(prev => {
        if (prev.breakTimer <= 1) {
          return { 
            ...prev, 
            view: 'exam', 
            currentModule: 2, 
            currentQuestionIndex: 0, 
            timer: MODULE_TIME,
            breakTimer: BREAK_DURATION
          };
        }
        return { ...prev, breakTimer: prev.breakTimer - 1 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [state.view]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    if (state.currentQuestionIndex < currentQuestions.length - 1) {
      setState(prev => ({ ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 }));
    } else {
      setState(prev => ({ ...prev, view: 'review' }));
    }
  };

  const handleBack = () => {
    if (state.currentQuestionIndex > 0) {
      setState(prev => ({ ...prev, currentQuestionIndex: prev.currentQuestionIndex - 1 }));
    }
  };

  const handleSubmitModule = () => {
    if (state.currentModule === 1) {
      setState(prev => ({ ...prev, view: 'break' }));
    } else {
      setState(prev => ({ ...prev, view: 'results' }));
    }
  };

  const toggleReview = () => {
    setState(prev => ({
      ...prev,
      reviewFlags: { ...prev.reviewFlags, [currentQuestion.id]: !prev.reviewFlags[currentQuestion.id] }
    }));
  };

  const handleOptionClick = (option: string) => {
    const questionId = currentQuestion.id;
    
    if (isEliminatorActive) {
      setState(prev => {
        const currentStrikes = prev.strikethroughs[questionId] || [];
        const isAlreadyStruck = currentStrikes.includes(option);
        const nextStrikes = isAlreadyStruck 
          ? currentStrikes.filter(o => o !== option) 
          : [...currentStrikes, option];
        
        const nextAnswers = { ...prev.answers };
        if (!isAlreadyStruck && nextAnswers[questionId] === option) {
          delete nextAnswers[questionId];
        }

        return {
          ...prev,
          strikethroughs: { ...prev.strikethroughs, [questionId]: nextStrikes },
          answers: nextAnswers
        };
      });
    } else {
      setState(prev => {
        const currentStrikes = prev.strikethroughs[questionId] || [];
        if (currentStrikes.includes(option)) return prev;
        return {
          ...prev,
          answers: { ...prev.answers, [questionId]: option }
        };
      });
    }
  };

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  if (state.view === 'results') {
    return <ResultsDashboard 
      questions={QUESTIONS} 
      answers={state.answers} 
      onRestart={() => window.location.reload()} 
      theme={theme}
    />;
  }

  return (
    <div 
      ref={mainContainerRef}
      className="flex flex-row w-[100vw] h-[100vh] overflow-hidden font-sans bg-white theme-transition" 
      style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)' }}
    >
      <AnimatePresence mode="wait">
        {state.view === 'break' && (
          <motion.div 
            key="break-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[250] bg-[#1E1E1E] flex flex-col items-center justify-center text-center p-8"
          >
            <div className="space-y-16 max-w-2xl flex flex-col items-center">
              <h2 className="text-xl font-black tracking-[0.4em] text-gray-400 uppercase">Module 1 Complete</h2>
              {/* REQUIREMENT: Massive bold white countdown numbers */}
              <motion.span 
                key={state.breakTimer}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-[20rem] font-black leading-none tabular-nums text-white select-none"
              >
                {state.breakTimer}
              </motion.span>
              <div className="flex flex-col items-center gap-4">
                <div className="inline-flex items-center gap-4 bg-white/5 border border-white/10 px-10 py-5 rounded-full backdrop-blur-xl shadow-2xl">
                  <Sparkles size={22} className="text-[#0077C8]" />
                  <p className="text-gray-300 text-sm font-medium tracking-tight">
                    Note: You would not have this kind of break between math modules in the actual SAT.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ReferenceSheet 
        isOpen={isReferenceOpen} 
        onClose={() => setIsReferenceOpen(false)} 
        theme={theme} 
        containerRef={mainContainerRef}
      />

      <LayoutGroup>
        {/* QUESTION PANEL: Pushed to the left when Calculator is open */}
        <motion.div 
          layout 
          className="flex-1 min-w-0 flex flex-col h-full overflow-hidden theme-transition"
        >
          <header className="h-14 flex items-center justify-between px-6 shrink-0 z-50 relative border-b theme-transition" style={{ backgroundColor: 'var(--bg-header)', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.1)' }}>
            <div className="flex items-center gap-3">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCalculatorOpen(!isCalculatorOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${isCalculatorOpen ? 'bg-[#0077C8]' : 'hover:bg-white/10'}`}
              >
                <CalculatorIcon size={18} />
                <span className="text-xs font-black uppercase tracking-[0.1em]">Calculator</span>
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsReferenceOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors hover:bg-white/10"
              >
                <BookOpen size={18} />
                <span className="text-xs font-black uppercase tracking-[0.1em]">Reference</span>
              </motion.button>
            </div>

            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-6">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-1.5 rounded-full border border-white/10">
                <TimerIcon size={16} className="text-gray-400" />
                <span className="text-lg font-bold w-16 text-center tabular-nums">
                  {state.isTimerVisible ? formatTime(state.timer) : '--:--'}
                </span>
                <button 
                  onClick={() => setState(prev => ({ ...prev, isTimerVisible: !prev.isTimerVisible }))}
                  className="ml-1 text-gray-400 hover:text-white transition-colors"
                >
                  {state.isTimerVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button onClick={toggleTheme} className="p-2 hover:bg-white/10 rounded-full text-gray-300">
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEliminatorActive(!isEliminatorActive)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg transition-all border ${
                  isEliminatorActive 
                    ? 'bg-[#0077C8] border-[#0077C8] text-white shadow-[0_0_15px_rgba(0,119,200,0.5)]' 
                    : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10'
                }`}
              >
                <StrikethroughIcon size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">ABC</span>
              </motion.button>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] bg-[#0077C8] px-5 py-2 rounded-lg min-w-[140px] text-center text-white">
                MODULE <span className="tabular-nums">{state.currentModule}</span>
              </div>
            </div>
          </header>

          <main className="flex-1 flex flex-col md:flex-row overflow-hidden theme-transition" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <AnimatePresence mode="wait">
              <motion.div 
                key={state.view === 'review' ? 'review' : `exam-mod-${state.currentModule}-${state.currentQuestionIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full flex flex-col md:flex-row overflow-hidden"
              >
                {state.view === 'review' ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto bg-white dark:bg-black/20 h-full">
                    <div className="max-w-4xl w-full space-y-12 py-12">
                      <div className="text-center space-y-4">
                        <h1 className="text-4xl font-black tracking-tighter">Review Module {state.currentModule}</h1>
                        <p className="text-gray-500 font-medium italic">Double-check your progress before the module ends.</p>
                      </div>
                      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-11 gap-4">
                        {currentQuestions.map((q, idx) => (
                          <button
                            key={q.id}
                            onClick={() => setState(prev => ({ ...prev, view: 'exam', currentQuestionIndex: idx }))}
                            className={`relative h-14 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                              state.answers[q.id] ? 'border-[#0077C8] bg-[#0077C8]/10 font-black' : 'border-gray-200 dark:border-gray-800 text-gray-400 hover:border-blue-500/50'
                            }`}
                          >
                            <span className="text-xs">{idx + 1}</span>
                            {state.reviewFlags[q.id] && <Bookmark size={10} className="absolute top-1 right-1 text-red-500" fill="currentColor" />}
                          </button>
                        ))}
                      </div>
                      <div className="flex justify-center gap-6 pt-8">
                        <button 
                          onClick={() => setState(prev => ({ ...prev, view: 'exam', currentQuestionIndex: currentQuestions.length - 1 }))}
                          className="px-10 py-3.5 rounded-full font-black text-[10px] uppercase tracking-widest border-2 border-gray-200 dark:border-gray-800 text-gray-500 transition-colors hover:bg-gray-100"
                        >
                          Back to Test
                        </button>
                        <button 
                          onClick={handleSubmitModule}
                          className="px-14 py-3.5 bg-[#0077C8] text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl"
                        >
                          {state.currentModule === 1 ? 'Go to Break' : 'Finish Section'}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 overflow-y-auto p-12 theme-transition" style={{ backgroundColor: 'var(--bg-primary)' }}>
                      <div className="max-w-2xl mx-auto space-y-12">
                        <div className="flex justify-between items-center">
                          <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                            Question {state.currentQuestionIndex + 1} of {currentQuestions.length}
                          </div>
                          <button 
                            onClick={toggleReview}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black tracking-widest transition-all ${
                              state.reviewFlags[currentQuestion.id] 
                                ? 'bg-red-500/10 text-red-500 border border-red-500/30' 
                                : 'text-gray-400 border border-transparent'
                            }`}
                          >
                            <Bookmark size={14} fill={state.reviewFlags[currentQuestion.id] ? "currentColor" : "none"} />
                            MARK FOR REVIEW
                          </button>
                        </div>
                        <div className="text-2xl leading-relaxed font-medium" style={{ color: 'var(--text-main)' }}>
                          <MathText text={currentQuestion.text} />
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 md:w-[45%] border-l p-12 overflow-y-auto theme-transition" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                      <div className="max-w-md mx-auto space-y-4">
                        {currentQuestion.options.map((option, idx) => {
                          const isSelected = state.answers[currentQuestion.id] === option;
                          const isStruck = (state.strikethroughs[currentQuestion.id] || []).includes(option);
                          const letter = String.fromCharCode(65 + idx);

                          return (
                            <motion.button
                              key={option}
                              layout
                              animate={{ opacity: isStruck ? 0.3 : 1 }}
                              onClick={() => handleOptionClick(option)}
                              className={`relative w-full flex items-center gap-6 p-6 rounded-2xl transition-all text-left shadow-md theme-transition ${
                                isSelected ? 'border-[#0077C8] ring-4 ring-[#0077C8]/10' : 'border-transparent'
                              }`}
                              style={{ backgroundColor: 'var(--bg-card)', border: isSelected ? '2px solid #0077C8' : '2px solid transparent' }}
                            >
                              <div className="shrink-0 relative">
                                <div className={`relative w-11 h-11 rounded-full border-2 flex items-center justify-center font-black text-sm transition-colors ${
                                  isSelected ? 'bg-[#0077C8] text-white border-[#0077C8]' : 'border-gray-200 text-gray-400'
                                }`}>
                                  {letter}
                                  {/* REQUIREMENT: Slash through letter when struck */}
                                  {isStruck && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                      <div className="w-[1.5px] h-full bg-red-500 rotate-45 transform" />
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="relative flex-1">
                                <div className="font-bold text-lg"><MathText text={option} /></div>
                                {/* REQUIREMENT: Width 100% strike-through line */}
                                <AnimatePresence>
                                  {isStruck && (
                                    <motion.div 
                                      initial={{ scaleX: 0 }}
                                      animate={{ scaleX: 1 }}
                                      exit={{ scaleX: 0 }}
                                      className="absolute top-1/2 left-0 right-0 h-[2.5px] bg-red-500/60 origin-left pointer-events-none"
                                    />
                                  )}
                                </AnimatePresence>
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </main>

          <footer className="h-20 border-t flex items-center justify-between px-10 shrink-0 z-50 theme-transition" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] w-32">
              MODULE <span className="tabular-nums">{state.currentModule}</span>
            </div>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsMapOpen(true)}
              className="flex items-center gap-6 px-10 py-3.5 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg bg-white dark:bg-white/5"
            >
              <Menu size={18} className="text-gray-400" />
              <span className="text-[11px] font-black uppercase tracking-[0.25em] text-gray-500">
                QUESTION <span className="tabular-nums">{state.currentQuestionIndex + 1}</span> OF <span className="tabular-nums">{currentQuestions.length}</span>
              </span>
            </motion.button>
            <div className="flex items-center gap-5 w-32 justify-end">
              <button 
                onClick={state.view === 'review' ? () => setState(prev => ({ ...prev, view: 'exam' })) : handleBack}
                className="p-3 rounded-full text-gray-400 hover:text-[#0077C8] hover:bg-blue-500/10 transition-all"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={state.view === 'review' ? handleSubmitModule : handleNext}
                className="flex items-center gap-2 px-10 py-3.5 bg-[#0077C8] text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </footer>
        </motion.div>

        {/* CALCULATOR PANEL: Flex-Push logic (Relative) */}
        <AnimatePresence>
          {isCalculatorOpen && (
            <motion.div
              layout
              initial={{ width: 0 }}
              animate={{ width: '38%' }}
              exit={{ width: 0 }}
              className="h-full border-l border-gray-200 dark:border-gray-800 overflow-hidden relative theme-transition"
              style={{ backgroundColor: 'var(--bg-primary)' }}
            >
              <CalculatorPanel isOpen={isCalculatorOpen} onClose={() => setIsCalculatorOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </LayoutGroup>

      <QuestionMap 
        isOpen={isMapOpen} 
        onClose={() => setIsMapOpen(false)}
        questions={currentQuestions}
        currentQuestionIndex={state.currentQuestionIndex}
        answers={state.answers}
        reviewFlags={state.reviewFlags}
        onSelectQuestion={(idx) => setState(prev => ({ ...prev, view: 'exam', currentQuestionIndex: idx }))}
        theme={theme}
      />
    </div>
  );
};

export default App;