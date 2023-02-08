import React from 'react';
import { Collection } from '../interfaces/Collection';
import { CollectionCard } from './CollectionCard';

export const CollectionList: React.FC<{ collections: any; gridStyle: string }> = ({ collections, gridStyle }) => {
  if (gridStyle === 'grid-compact') {
    return (
      <div className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-3">
        {collections['hydra:member'].map((collection: Collection) => (
          <CollectionCard key={collection.id} collection={collection} gridStyle={gridStyle} />
        ))}
      </div>
    );
  } else if (gridStyle === 'list') {
    return (
      <div className="grid grid-cols-1 gap-x-6 gap-y-8">
        {collections['hydra:member'].map((collection: Collection) => (
          <CollectionCard key={collection.id} collection={collection} gridStyle={gridStyle} />
        ))}
      </div>
    );
  } else {
    return (
      <div className="grid grid-cols-4 gap-x-6 gap-y-8 sm:grid-cols-4 lg:grid-cols-6">
        {collections['hydra:member'].map((collection: Collection) => (
          <CollectionCard key={collection.id} collection={collection} gridStyle={gridStyle} />
        ))}
      </div>
    );
  }
};
