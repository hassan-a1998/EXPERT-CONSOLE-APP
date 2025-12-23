import { useState } from 'react';

export function useAssessment(initial = null) {
  const [assessment, setAssessment] = useState(initial);
  return { assessment, setAssessment };
}
