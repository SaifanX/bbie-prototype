'use client'

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the graph to avoid SSR issues
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

export default function RelationshipGraph({ data }: { data: any }) {
  const fgRef = useRef<any>();
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
        nodeColor={(node: any) => node.group === 'business' ? '#6366f1' : '#f59e0b'}
        nodeRelSize={6}
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={0.005}
        linkColor={() => 'rgba(255, 255, 255, 0.1)'}
        backgroundColor="rgba(0,0,0,0)"
        width={1000}
        height={600}
        onNodeClick={(node: any) => {
          // Aim at node from outside it
          if (fgRef.current) {
            fgRef.current.centerAt(node.x, node.y, 1000);
            fgRef.current.zoom(2, 1000);
          }
        }}
      />
      
      {/* Legend */}
      <div className="absolute bottom-6 right-6 p-4 glass-card border-white/10 flex flex-col gap-2">
         <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-indigo-500" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Verified Business</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Source Record</span>
         </div>
      </div>
    </div>
  );
}
