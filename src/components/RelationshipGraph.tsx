'use client'

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the graph to avoid SSR issues
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

export default function RelationshipGraph({ data }: { data: any }) {
  const fgRef = useRef<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full h-full relative">
      <ForceGraph2D
        ref={fgRef}
        graphData={data}
        nodeLabel="name"
        nodeColor={(node: any) => node.group === 'business' ? '#ff6b00' : '#71717a'}
        nodeRelSize={6}
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={0.005}
        linkColor={() => 'rgba(255, 255, 255, 0.1)'}
        backgroundColor="rgba(0,0,0,0)"
        onNodeClick={(node: any) => {
          // Aim at node from outside it
          if (fgRef.current) {
            fgRef.current.centerAt(node.x, node.y, 1000);
            fgRef.current.zoom(2, 1000);
          }
        }}
      />
      
      {/* Legend */}
      <div className="absolute bottom-6 right-6 p-4 glass-card border-white/5 bg-black/40 backdrop-blur-md flex flex-col gap-2">
         <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff6b00] shadow-[0_0_8px_#ff6b00]" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Verified Identity</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-zinc-500" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Fragment Source</span>
         </div>
      </div>
    </div>
  );
}
