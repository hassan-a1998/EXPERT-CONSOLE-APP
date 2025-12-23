import React, { useEffect, useMemo } from 'react';

function severityWeight(s) {
  if (!s) return 0;
  switch (s) {
    case 'light': return 1;
    case 'moderate': return 2;
    case 'severe': return 3;
    default: return 0;
  }
}

export default function GradeCalculator({ defects = {}, baseValue = 100, onChange }) {
  const { score, grade, multiplier, price } = useMemo(() => {
    const keys = Object.keys(defects || {});
    const total = keys.reduce((acc, k) => acc + severityWeight(defects[k]?.severity), 0);
    const score = Math.max(0, 100 - total * 12); // simple formula
    let grade = 'A';
    if (score < 85 && score >= 70) grade = 'B';
    else if (score < 70 && score >= 50) grade = 'C';
    else if (score < 50) grade = 'D';
    const multiplier = grade === 'A' ? 1 : grade === 'B' ? 0.8 : grade === 'C' ? 0.6 : 0.3;
    const price = Math.round(baseValue * multiplier);
    return { score, grade, multiplier, price };
  }, [defects, baseValue]);

  useEffect(() => {
    onChange && onChange({ score, grade, price });
  }, [score, grade, price, onChange]);

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="text-lg font-semibold mb-2">Grade & Estimate</div>
      <div className="flex gap-4 items-center">
        <div>
          <div className="text-sm text-gray-500">Score</div>
          <div className="text-xl font-bold">{Math.round(score)}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Grade</div>
          <div className="text-2xl font-extrabold">{grade}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Est. price</div>
          <div className="text-lg font-semibold">${price}</div>
        </div>
      </div>
    </div>
  );
}
