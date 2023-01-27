import React from "react";
import { Link } from "react-router-dom";
import { Nft } from "../interfaces/nft";
import { NftCard } from "./NftCard";


export const Collection: React.FC<{ collectionNfts: any, gridStyle: String }> = ({ collectionNfts, gridStyle }) => {
    if (gridStyle === "grid-compact") {
    return <div className="grid grid-cols-3 gap-x-6 gap-y-8">
            {collectionNfts['hydra:member'].map((nft: Nft) => (
            <NftCard key={nft.id} nft={nft} />
            ))}
        </div>
    } else if (gridStyle === "list") {
        return <div className="grid grid-cols-1 gap-x-6 gap-y-8">
            {collectionNfts['hydra:member'].map((nft: Nft) => (
            <Link
            to={`/nfts/${nft.id}`}  
            className="grid grid-cols-5 rounded-xl h-42 bg-white/90 text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5  backdrop-blur dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10"
        >
            <div>
                <img className="rounded-xl h-40 w-40 m-2" src={nft.thumbnailUri} />
            </div>
            <div className="flex w-full px-3 py-4">
                <div className="text-2xl font-bold">{nft.name}</div>
            </div>
            
        </Link>
            ))}
        </div>
    } else {
        return <div className="grid grid-cols-6 gap-x-6 gap-y-8">
            {collectionNfts['hydra:member'].map((nft: Nft) => (
            <NftCard key={nft.id} nft={nft} />
            ))}
        </div>
    }
};
