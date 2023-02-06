import React from 'react';
import { useParams } from 'react-router';
import useSWR from 'swr';
import { Collection } from '../../components/Collection';
import { Container } from '../../components/Container';
import {fetcher} from "../../utilities/fetcher";

export const CollectionPage: React.FC = () => {
  const {id} = useParams();
  //id = 'col1vkehesfftd7j9ae7ufaq42rtry69hckm00tf70tc527jkq42qw6sk0pxpy';
  const { data: collection, error, isLoading } = useSWR(`/api/collections/${id}`, fetcher);

  const {
    data: collectionNfts,
    error: errorNfts,
    isLoading: isLoadingNfts,
  } = useSWR(`/api/collections/${id}/nfts`, fetcher);

  const [gridStyle, setGridStyle] = React.useState("grid-compact");
  const bannerUrl = collection?.attributes.find((attributes: { type: string; }) => attributes.type === "banner").value;
  const iconUrl = collection?.attributes.find((attributes: { type: string; }) => attributes.type === "icon").value;
  const description = collection?.attributes.find((attributes: { type: string; }) => attributes.type === "description").value;
  const website = collection?.attributes.find((attributes: { type: string; }) => attributes.type === "website") ? collection?.attributes.find((attributes: { type: string; }) => attributes.type === "website").value : "zesz";
  const twitter = collection?.attributes.find((attributes: { type: string; }) => attributes.type === "twitter") ? collection?.attributes.find((attributes: { type: string; }) => attributes.type === "twitter").value : null;
  const twitterLink = `https://twitter.com/${twitter}`;

  const renderHeader = () => 
  (isLoading ? <div>Loading...</div> : (
      <div className="-mt-10 mb-20 sm:mb-5">
          <div className="w-full h-60 flex bg-center rounded-xl brightness-105 dark:brightness-95" style={{ backgroundImage: `url(${bannerUrl})` }}> </div>
          <div className='sm:ml-10 flex sm:space-x-8'>
            <div className='-translate-y-24 translate-x-4 sm:-translate-y-1/3 sm:translate-x-0'>
             <div className="w-20 h-20 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-center rounded-xl border-4 border-zinc-50 dark:border-zinc-800 shadow-lg backdrop-blur" style={{ backgroundImage: `url(${iconUrl})` }}></div> 
              <div className='translate-x-4 translate-y-60 sm:translate-y-0 sm:translate-x-0 grid grid-cols-2 justify-items-center mt-6'> 
                {twitter?<a href={twitterLink}><TwitterSvg></TwitterSvg></a>:null}       
                {website?<a href={website}><WebsiteSvg></WebsiteSvg></a>:null}
              </div>
            </div>
           
            <div className='-translate-x-10 sm:translate-x-0 w-full sm:w-8/12 dark:text-white/90'>
              <div className="text-5xl font-bold mt-4 sm:text-4xl lg:text-6xl">{collection?.name}</div>
              <div className="text-sm sm:text-sm mt-4 lg:text-base xl:text-lg">{description}</div>
            </div>
    
          
          </div>
        </div>
       
      
  

  ));
  const renderGallery = () =>
    isLoadingNfts ? (
      <div>Loading NFTs...</div>
    ) : (
        <div>
          <div className='w-100 flex justify-end mb-2'>
            <button onClick={() => setGridStyle("list")} className="hover:bg-slate-200 dark:hover:bg-gray-800 py-2 px-4 rounded"><List></List></button>
            <button onClick={() => setGridStyle("grid-compact")} className="hover:bg-slate-200 dark:hover:bg-gray-800 py-2 px-4 rounded"><Grid_K></Grid_K></button>
            <button onClick={() => setGridStyle("grid")} className="hover:bg-slate-200 dark:hover:bg-gray-800 py-2 px-4 rounded"><Grid_G></Grid_G></button>
          </div>
          <Collection collectionNfts={collectionNfts} gridStyle={gridStyle} />
        </div>
    );
  return (
    <>
    
      <Container className="my-16 sm:mt-32">
      <div className="">{renderHeader()}</div>
        <div>{renderGallery()}</div>
      </Container>
    </>
  );
};


export const Grid_K = () => {
  return (
  <svg
  xmlns="http://www.w3.org/2000/svg"
  className='h-6 w-6 fill-black dark:fill-white'
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
    />
  </svg>
  );
}

export const Grid_G = () => {
  return (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    className='h-6 w-6 fill-black dark:fill-white'
  >
    <g transform="matrix(0.636364,0,0,0.636364,1.23864,1.23864)">
      <path
        d="M3.75,6C3.75,4.766 4.766,3.75 6,3.75L8.25,3.75C9.484,3.75 10.5,4.766 10.5,6L10.5,8.25C10.5,9.484 9.484,10.5 8.25,10.5L6,10.5C4.766,10.5 3.75,9.484 3.75,8.25L3.75,6ZM3.75,15.75C3.75,14.516 4.766,13.5 6,13.5L8.25,13.5C9.484,13.5 10.5,14.516 10.5,15.75L10.5,18C10.5,19.234 9.484,20.25 8.25,20.25L6,20.25C4.766,20.25 3.75,19.234 3.75,18L3.75,15.75ZM13.5,6C13.5,4.766 14.516,3.75 15.75,3.75L18,3.75C19.234,3.75 20.25,4.766 20.25,6L20.25,8.25C20.25,9.484 19.234,10.5 18,10.5L15.75,10.5C14.516,10.5 13.5,9.484 13.5,8.25L13.5,6ZM13.5,15.75C13.5,14.516 14.516,13.5 15.75,13.5L18,13.5C19.234,13.5 20.25,14.516 20.25,15.75L20.25,18C20.25,19.234 19.234,20.25 18,20.25L15.75,20.25C14.516,20.25 13.5,19.234 13.5,18L13.5,15.75Z"
        
      />
    </g>
    <g transform="matrix(0.636364,0,0,0.636364,7.48864,1.23864)">
      <path
        d="M13.5,6C13.5,4.766 14.516,3.75 15.75,3.75L18,3.75C19.234,3.75 20.25,4.766 20.25,6L20.25,8.25C20.25,9.484 19.234,10.5 18,10.5L15.75,10.5C14.516,10.5 13.5,9.484 13.5,8.25L13.5,6ZM13.5,15.75C13.5,14.516 14.516,13.5 15.75,13.5L18,13.5C19.234,13.5 20.25,14.516 20.25,15.75L20.25,18C20.25,19.234 19.234,20.25 18,20.25L15.75,20.25C14.516,20.25 13.5,19.234 13.5,18L13.5,15.75Z"
        
      />
    </g>
    <g transform="matrix(0.636364,0,0,0.636364,7.48864,7.48864)">
      <path
        d="M13.5,15.75C13.5,14.516 14.516,13.5 15.75,13.5L18,13.5C19.234,13.5 20.25,14.516 20.25,15.75L20.25,18C20.25,19.234 19.234,20.25 18,20.25L15.75,20.25C14.516,20.25 13.5,19.234 13.5,18L13.5,15.75Z"
        
      />
    </g>
    <g transform="matrix(0.636364,0,0,0.636364,1.23864,7.48864)">
      <path
        d="M3.75,15.75C3.75,14.516 4.766,13.5 6,13.5L8.25,13.5C9.484,13.5 10.5,14.516 10.5,15.75L10.5,18C10.5,19.234 9.484,20.25 8.25,20.25L6,20.25C4.766,20.25 3.75,19.234 3.75,18L3.75,15.75ZM13.5,15.75C13.5,14.516 14.516,13.5 15.75,13.5L18,13.5C19.234,13.5 20.25,14.516 20.25,15.75L20.25,18C20.25,19.234 19.234,20.25 18,20.25L15.75,20.25C14.516,20.25 13.5,19.234 13.5,18L13.5,15.75Z"
        
      />
    </g>
  </svg>
  )
}

export const List = () => {
  return ( 
    <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className='h-6 w-6 fill-black dark:fill-white'
    viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
    </svg>
  )
}

export const TwitterSvg = () => {
  return (
    <svg
    className='h-10 w-10 fill-none stroke-gray-800 dark:stroke-gray-200'
    viewBox="0 0 20 20">
							<path fill="evenodd" d="M18.258,3.266c-0.693,0.405-1.46,0.698-2.277,0.857c-0.653-0.686-1.586-1.115-2.618-1.115c-1.98,0-3.586,1.581-3.586,3.53c0,0.276,0.031,0.545,0.092,0.805C6.888,7.195,4.245,5.79,2.476,3.654C2.167,4.176,1.99,4.781,1.99,5.429c0,1.224,0.633,2.305,1.596,2.938C2.999,8.349,2.445,8.19,1.961,7.925C1.96,7.94,1.96,7.954,1.96,7.97c0,1.71,1.237,3.138,2.877,3.462c-0.301,0.08-0.617,0.123-0.945,0.123c-0.23,0-0.456-0.021-0.674-0.062c0.456,1.402,1.781,2.422,3.35,2.451c-1.228,0.947-2.773,1.512-4.454,1.512c-0.291,0-0.575-0.016-0.855-0.049c1.588,1,3.473,1.586,5.498,1.586c6.598,0,10.205-5.379,10.205-10.045c0-0.153-0.003-0.305-0.01-0.456c0.7-0.499,1.308-1.12,1.789-1.827c-0.644,0.28-1.334,0.469-2.06,0.555C17.422,4.782,17.99,4.091,18.258,3.266"></path>
		</svg>
  )
}

export const WebsiteSvg = () => {
  return (
  <svg 
  className='h-10 w-10 fill-gray-800 dark:fill-gray-200'
  viewBox="0 0 20 20">
							<path fill="evenidd" d="M10,2.531c-4.125,0-7.469,3.344-7.469,7.469c0,4.125,3.344,7.469,7.469,7.469c4.125,0,7.469-3.344,7.469-7.469C17.469,5.875,14.125,2.531,10,2.531 M10,3.776c1.48,0,2.84,0.519,3.908,1.384c-1.009,0.811-2.111,1.512-3.298,2.066C9.914,6.072,9.077,5.017,8.14,4.059C8.728,3.876,9.352,3.776,10,3.776 M6.903,4.606c0.962,0.93,1.82,1.969,2.53,3.112C7.707,8.364,5.849,8.734,3.902,8.75C4.264,6.976,5.382,5.481,6.903,4.606 M3.776,10c2.219,0,4.338-0.418,6.29-1.175c0.209,0.404,0.405,0.813,0.579,1.236c-2.147,0.805-3.953,2.294-5.177,4.195C4.421,13.143,3.776,11.648,3.776,10 M10,16.224c-1.337,0-2.572-0.426-3.586-1.143c1.079-1.748,2.709-3.119,4.659-3.853c0.483,1.488,0.755,3.071,0.784,4.714C11.271,16.125,10.646,16.224,10,16.224 M13.075,15.407c-0.072-1.577-0.342-3.103-0.806-4.542c0.673-0.154,1.369-0.243,2.087-0.243c0.621,0,1.22,0.085,1.807,0.203C15.902,12.791,14.728,14.465,13.075,15.407 M14.356,9.378c-0.868,0-1.708,0.116-2.515,0.313c-0.188-0.464-0.396-0.917-0.621-1.359c1.294-0.612,2.492-1.387,3.587-2.284c0.798,0.97,1.302,2.187,1.395,3.517C15.602,9.455,14.99,9.378,14.356,9.378"></path>
	</svg>
  )
}
