
import React, { useEffect, useRef, useMemo } from 'react';
import katex from 'katex';

interface MathTextProps {
  text: string;
}

const MathText: React.FC<MathTextProps> = ({ text }) => {
  const containerRef = useRef<HTMLSpanElement>(null);

  const parts = useMemo(() => {
    return text.split(/(\$.*?\$)/g);
  }, [text]);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    parts.forEach(part => {
      const span = document.createElement('span');
      if (part.startsWith('$') && part.endsWith('$')) {
        const math = part.slice(1, -1);
        try {
          katex.render(math, span, { throwOnError: false, displayMode: false });
        } catch (e) {
          span.textContent = part;
        }
      } else {
        span.textContent = part;
      }
      containerRef.current?.appendChild(span);
    });
  }, [parts]);

  return <span ref={containerRef} className="inline-block" />;
};

export default MathText;
