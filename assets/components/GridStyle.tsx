import React from 'react';
import { List, Grid_K, Grid_G } from './Icons';

export const GridStyle: React.FC<{ gridStyle: string; setGridStyle: (term: string) => void }> = ({
  gridStyle,
  setGridStyle,
}) => {
  return (
    <div>
      <button
        onClick={() => setGridStyle('list')}
        className="rounded py-2 px-4 hover:bg-slate-200 dark:hover:bg-gray-800"
      >
        <List></List>
      </button>
      <button
        onClick={() => setGridStyle('grid-compact')}
        className="rounded py-2 px-4 hover:bg-slate-200 dark:hover:bg-gray-800"
      >
        <Grid_K></Grid_K>
      </button>
      <button
        onClick={() => setGridStyle('grid')}
        className="rounded py-2 px-4 hover:bg-slate-200 dark:hover:bg-gray-800"
      >
        <Grid_G></Grid_G>
      </button>
    </div>
  );
};
