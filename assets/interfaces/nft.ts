export interface Nft {
  "@id"?: string;
  id?: string;
  launcherId?: string;
  name?: string;
  description?: string;
  royaltyPercentage?: number;
  royaltyAddress?: string;
  dataUris?: any;
  dataHash?: string;
  metaUris?: any;
  metaHash?: string;
  licenseUris?: any;
  licenseHash?: string;
  editionNumber?: number;
  editionTotal?: number;
  seriesNumber?: number;
  seriesTotal?: number;
  attributes?: any;
  mintHeight?: number;
  collection?: string;
  thumbnailUri?: string;
}
