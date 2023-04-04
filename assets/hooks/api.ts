import useSWR from 'swr';
import { fetcher } from '../utilities/fetcher';

export function useCollection(collectionId: string, order?: string) {
  if (order) {
    order = `?order=${order}`;
  } else {
    order = '';
  }
  const { data: collection, error, isLoading } = useSWR(`/api/collections/${collectionId}`, fetcher);
  const {
    data: collectionNfts,
    error: errorNfts,
    isLoading: isNftsLoading,
  } = useSWR(`/api/collections/${collectionId}/nfts${order}`, fetcher);

  if (isLoading || isNftsLoading) {
    return { isLoading: true };
  }

  if (error || errorNfts) {
    return { isLoading, error: error || errorNfts };
  }
  return { nfts: collectionNfts['hydra:member'], collection, error: undefined, isLoading: false };
}

export function useProfile(didId: string, createdOrder?: string, ownedOrder?: string) {
  createdOrder ? (createdOrder = `?order=${createdOrder}`) : (createdOrder = '');
  ownedOrder ? (ownedOrder = `?order=${ownedOrder}`) : (ownedOrder = '');
  const { data: did, error, isLoading } = useSWR(`/api/dids/${didId}`, fetcher);

  const {
    data: createdNfts,
    error: createderrorNfts,
    isLoading: isLoadingCreatedNfts,
  } = useSWR(`/api/dids/${didId}/created_nfts${createdOrder}`, fetcher);

  const {
    data: ownedNfts,
    error: ownederrorNfts,
    isLoading: isLoadingOwnedNfts,
  } = useSWR(`/api/dids/${didId}/owned_nfts${ownedOrder}`, fetcher);

  if (isLoading || isLoadingCreatedNfts || isLoadingOwnedNfts) {
    return { isLoading: true };
  }

  if (error || createderrorNfts || ownederrorNfts) {
    return { isLoading, error: error || createderrorNfts || ownederrorNfts };
  }
  return {
    createdNfts: createdNfts['hydra:member'],
    ownedNfts: ownedNfts['hydra:member'],
    did,
    error: undefined,
    isLoading: false,
  };
}

export function useSearch(searchTerm: string) {
  const { data: nfts, isLoading: isLoadingNfts, error: errorNfts } = useSWR(`/api/nfts?search=${searchTerm}`, fetcher);
  const {
    data: collections,
    isLoading: isLoadingCollections,
    error: errorCollections,
  } = useSWR(`/api/collections?search=${searchTerm}`, fetcher);

  if (isLoadingNfts || isLoadingCollections) {
    return { isLoading: true };
  }

  if (errorNfts || errorCollections) {
    return { isLoading: false, error: errorNfts || errorCollections };
  }
  return { nfts: nfts['hydra:member'], collections: collections['hydra:member'], error: undefined, isLoading: false };
}
