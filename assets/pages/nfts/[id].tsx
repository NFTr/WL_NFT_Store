import React, {useState} from 'react';
import {useParams} from 'react-router-dom';
import useSWR from 'swr';
import {Container} from '../../components/Container';
import {Nft} from '../../interfaces/nft';
import {fetcher} from '../../utilities/fetcher';

export const NftPage: React.FC = () => {
    const {id} = useParams();

    const [isZoomedIn, setIsZoomedIn] = useState(false);

    const toggleZoom = () => {
        setIsZoomedIn(!isZoomedIn);
    };

    const {data: nft, error, isLoading} = useSWR<Nft>(`/api/nfts/${id}`, fetcher);

    return (
        <Container className="flex flex-col items-center">
            <div className="mt-4 flex h-[50vh] w-full lg:h-[80vh]">
                <div className="flex items-center justify-center">
                    {nft && (
                        <div
                            className={
                                isZoomedIn
                                    ? 'fixed inset-0 z-50 flex h-auto max-h-full w-auto max-w-full items-center justify-center bg-zinc-800'
                                    : 'flex-1 rounded-xl'
                            }
                        >
                            <img
                                onClick={toggleZoom}
                                src={nft.previewUri}
                                className={`max-h-full ${
                                    isZoomedIn ? 'relative cursor-zoom-out' : 'cursor-zoom-in rounded-xl'
                                } object-contain`}
                            />
                        </div>
                    )}
                </div>
            </div>
            <div
                className="flex rounded-xl bg-white/90 p-6 text-sm font-medium text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10">
                {nft ? (
                    <div>
                        <h1 className="text-4xl font-semibold">{nft.name}</h1>
                        <p className="mt-4">{nft.description}</p>
                    </div>
                ) : (
                    <div>Loading...</div>
                )}
            </div>
        </Container>
    );
};
