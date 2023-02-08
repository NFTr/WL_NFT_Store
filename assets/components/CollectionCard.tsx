import React from 'react';
import { Link } from 'react-router-dom';
import { Collection } from '../interfaces/collection';

export const CollectionCard: React.FC<{ collection: Collection, gridStyle: string }> = ({ collection, gridStyle }) => {
    const bannerUrl = collection?.attributes.find((attributes: { type: string; }) => attributes.type === "banner").value;
    const iconUrl = collection?.attributes.find((attributes: { type: string; }) => attributes.type === "icon").value;
    const description = collection?.attributes.find((attributes: { type: string; }) => attributes.type === "description").value;

    if (gridStyle === "grid-compact") {
        return <Link
        to={`/collections/${collection.id}`}
        className="flex flex-col items-center rounded-xl bg-white/90 text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5  backdrop-blur dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10"
    >
        <div>
            <img className="rounded-t-xl" src={iconUrl} />
        </div>
        <div className="flex w-full px-3 py-4">
            <div className="text-lg font-bold">{collection.name}</div>
        </div>
    </Link>;
    } else if (gridStyle === "list") {
        return <Link
        to={`/collections/${collection.id}`}
        className="rounded-xl w-full h-32 bg-white/90 text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5  backdrop-blur dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10"
        
    >
        <div className="w-full h-32 flex bg-center blur-sm brightness-110 dark:brightness-50" style={{ backgroundImage: `url(${bannerUrl})` }}></div>
        <div className="w-full h-32 flex items-center -translate-y-32"> 
            <div className="w-28 sm:w-48 mx-4">
                <img className="rounded-xl" src={iconUrl} />
            </div>
            
            <div className="text-xl font-bold">{collection.name}</div>
            <div className="ml-4 text-xs leading-none md:text-base xl:text-lg text-block hidden sm:flex">{description}</div>

        </div>
    </Link>;
    } else if (gridStyle === "grid") {
        return <Link
        to={`/collections/${collection.id}`}
        className="flex flex-col items-center rounded-xl bg-white/90 text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5  backdrop-blur dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10"
    >
        <div>
            <img className="rounded-t-xl" src={iconUrl} />
        </div>
        <div className="flex w-full px-3 py-4">
            <div className="text-lg font-bold">{collection.name}</div>
        </div>
    </Link>;
    } else  {
        return <Link
        to={`/collections/${collection.id}`}
        className="flex flex-col items-center rounded-xl bg-white/90 text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5  backdrop-blur dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10"
    >
        <div>
            <img className="rounded-t-xl" src={iconUrl} />
        </div>
        <div className="flex w-full px-3 py-4">
            <div className="text-lg font-bold">{collection.name}</div>
        </div>
    </Link>;
    }
};
