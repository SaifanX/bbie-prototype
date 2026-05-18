import { PinAuthClient } from './PinAuthClient';
import { Suspense } from 'react';

export default function PinAuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#09090b] flex items-center justify-center text-zinc-500 font-mono text-sm">Loading security gate...</div>}>
      <PinAuthClient />
    </Suspense>
  );
}
