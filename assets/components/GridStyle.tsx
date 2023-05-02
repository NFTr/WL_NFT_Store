import React from 'react';
import { List, Grid_K, Grid_G } from './Icons';

export const GridStyle: React.FC<{ gridStyle: string; setGridStyle: (term: string) => void }> = ({
  gridStyle,
  setGridStyle,
}) => {
  return (
    <div className="flex gap-3">
      <button
        onClick={() => setGridStyle('list')}
        className={
          'rounded-lg bg-white/90 py-2 px-4 text-lg font-bold text-zinc-800 shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 hover:bg-slate-200 dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10 dark:hover:bg-zinc-600' +
          (gridStyle === 'list' ? ' bg-slate-100 dark:bg-zinc-600' : '')
        }
      >
        <List></List>
      </button>
      <button
        onClick={() => setGridStyle('grid-compact')}
        className={
          'rounded-lg bg-white/90 py-2 px-4 text-lg font-bold text-zinc-800 shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 hover:bg-slate-200 dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10 dark:hover:bg-zinc-600' +
          (gridStyle === 'grid-compact' ? ' bg-slate-100 dark:bg-zinc-600' : '')
        }
      >
        <Grid_K></Grid_K>
      </button>
      <button
        onClick={() => setGridStyle('grid')}
        className={
          'rounded-lg bg-white/90 py-2 px-4 text-lg font-bold text-zinc-800 shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 hover:bg-slate-200 dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10 dark:hover:bg-zinc-600' +
          (gridStyle === 'grid' ? ' bg-slate-100 dark:bg-zinc-600' : '')
        }
      >
        <Grid_G></Grid_G>
      </button>
    </div>
  );
};
