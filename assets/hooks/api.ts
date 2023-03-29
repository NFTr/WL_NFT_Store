import useSWR from 'swr';
import { fetcher } from '../utilities/fetcher';

export function useCollection(collectionId: string) {
  const { data: collection, error, isLoading } = useSWR(`/api/collections/${collectionId}`, fetcher);
  const {
    data: collectionNfts,
    error: errorNfts,
    isLoading: isNftsLoading,
  } = useSWR(`/api/collections/${collectionId}/nfts`, fetcher);

  if (isLoading || isNftsLoading) {
    return { isLoading: true };
  }

  if (error || errorNfts) {
    return { isLoading, error: error || errorNfts };
  }
  return { nfts: collectionNfts['hydra:member'], collection, error: undefined, isLoading: false };
}

export function useProfile(didId: string) {
  const { data: did, error, isLoading } = useSWR(`/api/dids/${didId}`, fetcher);

  const {
    data: createdNfts,
    error: createderrorNfts,
    isLoading: isLoadingCreatedNfts,
  } = useSWR(`/api/dids/${didId}/created_nfts`, fetcher);

  const {
    data: ownedNfts,
    error: ownederrorNfts,
    isLoading: isLoadingOwnedNfts,
  } = useSWR(`/api/dids/${didId}/owned_nfts`, fetcher);

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
