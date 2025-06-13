import React from 'react';
// @ts-ignore
import MathJax from 'react-mathjax-preview';

interface MathDisplayProps {
  content: string;
}

const MathDisplay: React.FC<MathDisplayProps> = ({ content }) => {
  return (
    <div className="text-left">
      <MathJax math={`$$${content}$$`} />
    </div>
  );
};

export default MathDisplay;
