import React from 'react';
// @ts-ignore
import MathJax from 'react-mathjax-preview';

interface MathDisplayProps {
  content: string;
}
function parseTextWithMath(text: string) {
  const parts = text.split(/(::.*?::)/); // ":: ... ::" অংশগুলো ধরবে
  return parts.map((part, i) => {
    const match = part.match(/::\s*(.*?)\s*::/);
    if (match) {
      return <MathDisplay key={i} content={match[1]} />;
    } else {
      return <span key={i}>{part}</span>;
    }
  });
}

const MathDisplay: React.FC<MathDisplayProps> = ({ content }) => {
  return (
    <div className="text-left">
      {content.includes('::') ? (
        <div className="flex items-center gap-1">{parseTextWithMath(content)}</div>
      ) : (
        <MathJax math={`$$${content}$$`} />
      )}
      {/* <MathJax math={`$$${content}$$`} /> */}
    </div>
  );
};

export default MathDisplay;
