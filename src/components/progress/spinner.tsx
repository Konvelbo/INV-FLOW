'use client';

import { ProgressCircle } from '@/src/components/ui/progress';

export default function ProgressSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <ProgressCircle value={25} size={32} strokeWidth={3} className="text-blue-black animate-spin" />
      </div>
    </div>
  );
}
