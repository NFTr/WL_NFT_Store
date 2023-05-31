import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import { fetcher } from '../utilities/fetcher';

function createQueryString(order?: { [key: string]: string }, search?: string, page?: number) {
  const params = new URLSearchParams();

  if (order) {
    let [key, value] = Object.entries(order)[0];
    params.set(`order[${key}]`, value);
  }

  if (search) {
    params.set('search', search);
  }

  if (page) {
    params.set('page', page.toString());
  }

  return params.toString();
}

export function useCollection(collectionId: string) {
  const { data: collection, error, isLoading } = useSWR(`/api/collections/${collectionId}`, fetcher);

  if (isLoading) {
    return { isLoading: true };
  }

  if (error) {
    return { isLoading, error };
  }

  return { collection, error: undefined, isLoading: false };
}

export function useCollectionNfts(collectionId: string, order?: { [key: string]: string }, search?: string) {
  console.log('useColl')
  const getKey = (pageIndex: number) => {
    const query = createQueryString(order, search, pageIndex+1);

    return `/api/collections/${collectionId}/nfts${query ? `?${query}` : ''}`; // SWR key
  };

  const {
    data: nftPages,
    error,
    isLoading,
    size,
    setSize,
  } = useSWRInfinite(getKey, fetcher, {
    // keepPreviousData: true,
  });


  const nfts = nftPages?.reduce((acc, page) => [...acc, ...page['hydra:member'] || []], []) || [];
  console.log(nfts)

  const hydraView = nftPages && nftPages[nftPages.length-1]['hydra:view'];
  const totalPages =
    hydraView && hydraView['hydra:last'] ? parseInt(hydraView['hydra:last'].match(/page=(\d+)/)[1], 10) : [];

  if (isLoading) {
    return { isLoading: true, nfts, size, setSize };
  }

  if (error) {
    return { isLoading, nfts, error, size, setSize };
  }

  return { nfts, error: undefined, isLoading: false, totalPages, size, setSize };
}

export function useProfile(didId: string) {
  const { data: did, error, isLoading } = useSWR(`/api/dids/${didId}`, fetcher);

  if (isLoading) {
    return { isLoading: true };
  }

  if (error) {
    return { isLoading, error };
  }

  return { did, error: undefined, isLoading: false };
}

export function useAddress(id: string) {
  const { data: address, error, isLoading } = useSWR(`/api/addresses/${id}`, fetcher);

  if (isLoading) {
    return { isLoading: true };
  }

  if (error) {
    return { isLoading, error };
  }

  return { address, error: undefined, isLoading: false };
}

export function useProfileNfts(
  didId: string,
  createdOrder?: { [key: string]: string },
  ownedOrder?: { [key: string]: string }
) {
  const createdOrderString = createQueryString(createdOrder);
  const ownedOrderString = createQueryString(ownedOrder);

  const {
    data: createdData,
    error: createderrorNfts,
    isLoading: isLoadingCreatedNfts,
  } = useSWR(`/api/dids/${didId}/created_nfts${createdOrderString ? `?${createdOrderString}` : ''}`, fetcher, {
    keepPreviousData: true,
  });

  const createdNfts = createdData?.['hydra:member'] || [];
  const {
    data: ownedData,
    error: ownederrorNfts,
    isLoading: isLoadingOwnedNfts,
  } = useSWR(`/api/dids/${didId}/owned_nfts${ownedOrderString ? `?${ownedOrderString}` : ''}`, fetcher, {
    keepPreviousData: true,
  });
  const ownedNfts = ownedData?.['hydra:member'] || [];

  if (isLoadingCreatedNfts || isLoadingOwnedNfts) {
    return { createdNfts, ownedNfts, isLoading: true };
  }

  if (createderrorNfts || ownederrorNfts) {
    return { createdNfts, ownedNfts, isLoading: false, error: createderrorNfts || ownederrorNfts };
  }
  return {
    createdNfts,
    ownedNfts,
    error: undefined,
    isLoading: false,
  };
}

export function useAddressNFTs(
  id: string,
  createdOrder?: { [key: string]: string },
  ownedOrder?: { [key: string]: string }
) {
  const createdOrderString = createQueryString(createdOrder);
  const ownedOrderString = createQueryString(ownedOrder);

  const {
    data: createdData,
    error: createderrorNfts,
    isLoading: isLoadingCreatedNfts,
  } = useSWR(`/api/addresses/${id}/created_nfts${createdOrderString ? `?${createdOrderString}` : ''}`, fetcher, {
    keepPreviousData: true,
  });

  const createdNfts = createdData?.['hydra:member'] || [];
  const {
    data: ownedData,
    error: ownederrorNfts,
    isLoading: isLoadingOwnedNfts,
  } = useSWR(`/api/addresses/${id}/owned_nfts${ownedOrderString ? `?${ownedOrderString}` : ''}`, fetcher, {
    keepPreviousData: true,
  });
  const ownedNfts = ownedData?.['hydra:member'] || [];

  if (isLoadingCreatedNfts || isLoadingOwnedNfts) {
    return { createdNfts, ownedNfts, isLoading: true };
  }

  if (createderrorNfts || ownederrorNfts) {
    return { createdNfts, ownedNfts, isLoading: false, error: createderrorNfts || ownederrorNfts };
  }
  return {
    createdNfts,
    ownedNfts,
    error: undefined,
    isLoading: false,
  };
}

export function useSearch(searchTerm: string, order: { [key: string]: string }) {
  const orderQueryString = createQueryString(order);
  const {
    data: dataNfts,
    isLoading: isLoadingNfts,
    error: errorNfts,
  } = useSWR(`/api/nfts?search=${searchTerm}&${orderQueryString}`, fetcher, { keepPreviousData: true });
  const nfts = dataNfts?.['hydra:member'] || [];

  const {
    data: dataCollections,
    isLoading: isLoadingCollections,
    error: errorCollections,
  } = useSWR(`/api/collections?search=${searchTerm}&${orderQueryString}`, fetcher, { keepPreviousData: true });
  const collections = dataCollections?.['hydra:member'] || [];

  if (isLoadingNfts || isLoadingCollections) {
    return { nfts, collections, isLoading: true };
  }

  if (errorNfts || errorCollections) {
    return { nfts, collections, isLoading: false, error: errorNfts || errorCollections };
  }
  return { nfts, collections, error: undefined, isLoading: false };
}
