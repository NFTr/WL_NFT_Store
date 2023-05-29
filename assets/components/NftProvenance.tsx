import React from 'react';
import { Link } from 'react-router-dom';
import { Nft } from '../interfaces/nft';
import { MintSVG, TradeSVG, TransferSVG } from './Icons';

export const NftProvenance: React.FC<{ nft: Nft }> = ({ nft }) => {
  function renderTimestamp(event: any) {
    return (
      <div className="flex items-center gap-1 text-gray-500">
        <div className="text-sm font-bold">
          {new Date(event.timestamp).toLocaleString('default', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })}
        </div>
        <div className="text-sm">
          {new Date(event.timestamp).toLocaleString('default', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    );
  }

  function renderOwnerOrAddress(event: any) {
    return (
      <>
        {event.owner ? (
          <Link className="font-bold" to={`/profiles/${event.owner.id}`}>
            {event.owner?.name || `${event.owner?.encodedId.substring(0, 20)}...`}
          </Link>
        ) : (
          <Link className="font-mono tracking-tighter" to={`/addresses/${event.address.id}`}>
            {event.address.name || event.address.encodedAddress.substring(0, 20)}
          </Link>
        )}
      </>
    );
  }

  function renderTradeEvent(event: any) {
    return (
      <div className="flex items-center gap-4">
        <TradeSVG />
        <div>
          <div className="flex items-center gap-1">
            <div className="flex flex-wrap items-center gap-1">
              <div className="font-medium">Acquired by</div>
              {renderOwnerOrAddress(event)}
              {event.xch_price ? <div>for</div> : ''}
            </div>
            {event.xch_price ? (
              <div className="flex items-center">
                <img className="h-8" src="/chiaLogo.png" alt="Chia logo" />
                <div className="font-medium">{event.xch_price} XCH</div>
              </div>
            ) : (
              ''
            )}
          </div>
          {renderTimestamp(event)}
        </div>
      </div>
    );
  }

  function renderTransferEvent(event: any) {
    return (
      <div className="flex items-center gap-4">
        <TransferSVG />
        <div>
          <div className="flex items-center gap-1">
            <div className="flex flex-wrap items-center gap-1">
              <div className="font-medium">Transferred to</div>
              <div>{renderOwnerOrAddress(event)}</div>
            </div>
          </div>
          {renderTimestamp(event)}
        </div>
      </div>
    );
  }

  function renderMintEvent(event: any) {
    return (
      <div className="flex items-center gap-4">
        <MintSVG />
        <div>
          <div>
            <div className="flex flex-wrap items-center gap-1">
              <div className="font-medium">Minted by</div>
              <div>{renderOwnerOrAddress(event)}</div>
            </div>
            {renderTimestamp(event)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <h3 className="text-2xl font-bold">Provenance</h3>
      <div className="mt-4 grid gap-4">
        {nft.events
          ?.sort((a, b) => b.event_index - a.event_index)
          .map((event) => (
            <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-600">
              {event.type === 'trade'
                ? renderTradeEvent(event)
                : event.type === 'mint'
                ? renderMintEvent(event)
                : renderTransferEvent(event)}
            </div>
          ))}
      </div>
    </>
  );
};
