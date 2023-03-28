import { EyeIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import { Container } from '../../components/Container';
import { Nft } from '../../interfaces/nft';
import { fetcher } from '../../utilities/fetcher';

export const NftPage: React.FC = () => {
  const { id } = useParams();

  const [isZoomedIn, setIsZoomedIn] = useState(false);

  const toggleZoom = () => {
    setIsZoomedIn(!isZoomedIn);
  };

  const getAttributeValue = (type: string): string => {
    return nft?.attributes.find((attributes: { type: string }) => attributes.type === type)?.value;
  };

  const { data: nft, error, isLoading } = useSWR<Nft>(`/api/nfts/${id}`, fetcher);
  const {
    data: offers,
    error: offerError,
    isLoading: isLoadingOffer,
  } = useSWR(`/api/nfts/${id}/offers?status=0`, fetcher);
  console.log(offers);

  function renderAttributes(attributes: any[]) {
    return (
      <>
        <h3 className="text-2xl font-bold">Attributes</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {attributes.map((attribute) => (
            <div
              className="rounded-lg border border-zinc-200 dark:border-zinc-600"
              key={attribute.name || attribute.trait_type}
            >
              <div className="relative block h-full rounded-lg p-4">
                <p className="break-words text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                  {attribute.name || attribute.trait_type}
                </p>
                <p className="break-words text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  {attribute.value || <>&nbsp;</>}
                </p>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  function renderDetails(nft: Nft) {
    return (
      <>
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="">
            <h3 className="text-2xl font-bold">Details</h3>
            <div className="mt-4 flex flex-col gap-4">
              <div>
                <a
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-zinc-100 dark:hover:text-zinc-300"
                  href={`https://www.spacescan.io/xch/nft/${nft.id}`}
                  target="_blank"
                >
                  <img className="h-6 w-6 rounded-full" src="/spacescan.ico" />
                  Inspect on spacescan.io
                </a>
              </div>
              <div>
                <a
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-zinc-100 dark:hover:text-zinc-300"
                  href={nft.dataUris[0]}
                  target="_blank"
                >
                  <EyeIcon className="h-6 w-6 rounded-full" />
                  Open original
                </a>
              </div>
            </div>
          </div>
          <div>
            {offers && offers['hydra:member'].length > 0 ? (
              <h3 className="mb-2 mt-8 text-2xl font-bold lg:mt-0">Listings</h3>
            ) : null}
            {offers ? (
              offers['hydra:member']
                .filter((offer: any) => offer.requested[0].id === 'xch')
                .map((offer: any) => (
                  <div className="mb-4 flex h-16 w-full items-center rounded-lg border border-zinc-200 p-4 dark:border-zinc-600">
                    <div className="flex items-center">
                      <img className="h-8" src="/chiaLogo.png" alt="Chia logo" />
                      <div className="ml-4 text-lg font-medium">{offer.requested[0].amount} XCH</div>
                      {offer.offered.id}
                    </div>
                    <div className="ml-4 flex items-center">
                      <div className="text-lg font-medium">@</div>
                      <a className="flex items-center" href={`https://dexie.space/offers/${offer.id}`}>
                        <img className="ml-4 h-10" src="/dexie_duck.svg" alt="Dexie logo" />
                        <div className="ml-4">
                          <div className="text-lg font-medium">dexie.space</div>
                          <div className="text-sm text-gray-500">
                            on {new Date(offer.dateFound).getDate()}.{' '}
                            {new Date(offer.dateFound).toLocaleString('default', { month: 'long' })}{' '}
                            {new Date(offer.dateFound).getFullYear()}
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                ))
            ) : (
              <div>Loading Offers</div>
            )}
            {offers && offers['hydra:member'].length > 0 ? (
              <h3 className="mb-2 mt-8 text-2xl font-bold">Bids</h3>
            ) : null}
            {offers ? (
              offers['hydra:member']
                .filter((offer: any) => offer.offered[0].id === 'xch')
                .map((offer: any) => (
                  <div className="mb-4 flex h-16 w-full items-center rounded-lg border border-zinc-200 p-4 dark:border-zinc-600">
                    <div className="flex items-center">
                      <img className="h-8" src="/chiaLogo.png" alt="Chia logo" />
                      <div className="ml-4 text-lg font-medium">{offer.offered[0].amount} XCH</div>
                    </div>
                    <div className="ml-4 flex items-center">
                      <div className="text-lg font-medium">@</div>
                      <a className="flex items-center" href={`https://dexie.space/offers/${offer.id}`}>
                        <img className="ml-4 h-10" src="/dexie_duck.svg" alt="Dexie logo" />
                        <div className="ml-4">
                          <div className="text-lg font-medium">dexie.space</div>
                          <div className="text-sm text-gray-500">
                            on {new Date(offer.dateFound).getDate()}.{' '}
                            {new Date(offer.dateFound).toLocaleString('default', { month: 'long' })}{' '}
                            {new Date(offer.dateFound).getFullYear()}
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                ))
            ) : (
              <div>Loading Offers</div>
            )}
          </div>
        </div>
      </>
    );
  }

  // const nft: any = undefined;
  return (
    <Container>
      <div className="my-8 flex flex-col gap-8">
        <div className="mt-4 flex w-full lg:h-[80vh]">
          {nft ? (
            <div className="flex w-full items-center justify-center overflow-hidden">
              <div
                className={
                  (isZoomedIn
                    ? 'fixed inset-0 z-50 flex h-auto max-h-full w-auto max-w-full items-center justify-center bg-zinc-800'
                    : 'rounded-xl') + ' h-full'
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
            </div>
          ) : (
            <div className="h-full w-full rounded-xl">
              <div className="aspect-1 h-full w-full animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800"></div>
            </div>
          )}
        </div>
        <div className="flex rounded-xl bg-white/90 p-6 font-medium text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10">
          {nft ? (
            <div className="w-full">
              <h1 className="text-4xl font-semibold lg:text-5xl">{nft.name}</h1>
              <p className="mt-4 lg:mt-8">{nft.description}</p>
              <div className="mt-12">{renderDetails(nft)}</div>
              {nft.attributes && nft.attributes.length > 0 ? (
                <div className="mt-12">{renderAttributes(nft.attributes)}</div>
              ) : (
                ''
              )}
            </div>
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </div>
    </Container>
  );
};
