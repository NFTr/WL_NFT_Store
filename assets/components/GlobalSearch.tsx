import { Combobox, Dialog, Transition } from '@headlessui/react';
import clsx from 'clsx';
import React, { forwardRef, Fragment, useEffect, useId, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSearch } from '../hooks/api';

function SearchIcon(props: any) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12.01 12a4.25 4.25 0 1 0-6.02-6 4.25 4.25 0 0 0 6.02 6Zm0 0 3.24 3.25"
      />
    </svg>
  );
}

function NoResultsIcon(props: any) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12.01 12a4.237 4.237 0 0 0 1.24-3c0-.62-.132-1.207-.37-1.738M12.01 12A4.237 4.237 0 0 1 9 13.25c-.635 0-1.237-.14-1.777-.388M12.01 12l3.24 3.25m-3.715-9.661a4.25 4.25 0 0 0-5.975 5.908M4.5 15.5l11-11"
      />
    </svg>
  );
}

function SearchResult({ result, resultIndex }: any) {
  let id = useId();
  return (
    <Combobox.Option
      key={result.id}
      value={result}
      className={({ active }) =>
        clsx(
          'group flex cursor-default items-center gap-2 px-4 py-3',
          resultIndex > 0 && 'border-t border-zinc-100 dark:border-zinc-800',
          active && 'bg-zinc-100 dark:bg-zinc-800/50'
        )
      }
      aria-labelledby={`${id}-hierarchy ${id}-title`}
    >
      <img className="h-12 w-12 rounded-md object-cover" src={result.thumbnailUri} />
      <div
        id={`${id}-title`}
        aria-hidden="true"
        className="text-sm font-medium text-zinc-900 group-aria-selected:text-emerald-500 dark:text-white"
      >
        {result.name}
      </div>
    </Combobox.Option>
  );
}

function SearchResults({ query, collection }: any) {
  if (collection.length === 0) {
    return (
      <div className="p-6 text-center">
        <NoResultsIcon className="mx-auto h-5 w-5 stroke-zinc-900 dark:stroke-zinc-600" />
        <p className="mt-2 text-xs text-zinc-700 dark:text-zinc-400">
          Nothing found for{' '}
          <strong className="break-words font-semibold text-zinc-900 dark:text-white">&lsquo;{query}&rsquo;</strong>.
          Please try again.
        </p>
      </div>
    );
  }

  return (
    <Combobox.Options>
      {collection.map((result: any, resultIndex: number) => (
        <SearchResult key={result.url} result={result} resultIndex={resultIndex} />
      ))}
    </Combobox.Options>
  );
}

const SearchInput = forwardRef(function SearchInput({ onClose, onChange }: any, inputRef: any) {
  return (
    <div className="group relative flex h-12">
      <SearchIcon className="pointer-events-none absolute left-3 top-0 h-full w-5 stroke-zinc-500" />
      <Combobox.Input
        ref={inputRef}
        className={clsx(
          'flex-auto appearance-none bg-transparent pl-10 text-zinc-900 outline-none placeholder:text-zinc-500 focus:w-full focus:flex-none dark:text-white sm:text-sm [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden [&::-webkit-search-results-button]:hidden [&::-webkit-search-results-decoration]:hidden',
          'pr-4'
        )}
        onChange={onChange}
        onKeyDown={(event: any) => {
          if (event.key === 'Escape') {
            // In Safari, closing the dialog with the escape key can sometimes cause the scroll position to jump to the
            // bottom of the page. This is a workaround for that until we can figure out a proper fix in Headless UI.
            (document.activeElement as any)?.blur();

            onClose();
          }
        }}
      />
    </div>
  );
});

function SearchDialog({ open, setOpen, className }: any) {
  const location = useLocation();
  const navigate = useNavigate();

  let formRef = useRef<any>();
  let panelRef = useRef<any>();
  let inputRef = useRef<any>();
  const [searchTerm, setSearchTerm] = useState('');
  const [orderTerm, setOrderTerm] = useState<{ [key: string]: string }>({ id: 'asc' });
  const { nfts, collections, isLoading } = useSearch(searchTerm, orderTerm);

  useEffect(() => {
    if (!open) {
      return;
    }
    setOpen(false);
  }, [location]);

  useEffect(() => {
    if (open) {
      return;
    }

    function onKeyDown(event: any) {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen(true);
      }
    }

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, setOpen]);

  return (
    <Transition.Root show={open} as={Fragment} afterLeave={() => setSearchTerm('')}>
      <Dialog onClose={setOpen} className={clsx('fixed inset-0 z-50', className)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-zinc-400/25 backdrop-blur-sm dark:bg-black/40" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto px-4 py-4 sm:px-6 sm:py-20 md:py-32 lg:px-8 lg:py-[15vh]">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="ring-zinc-900/7.5 mx-auto overflow-hidden rounded-lg bg-zinc-50 shadow-xl ring-1 dark:bg-zinc-900 dark:ring-zinc-800 sm:max-w-xl">
              <Combobox onChange={(nft: any) => navigate(`/nfts/${nft.id}`)}>
                <SearchInput
                  ref={inputRef}
                  onClose={() => setOpen(false)}
                  onChange={(event: any) => setSearchTerm(event.target.value)}
                />

                <div
                  ref={panelRef}
                  className="border-t border-zinc-200 empty:hidden dark:border-zinc-100/5 dark:bg-white/2.5"
                >
                  {open && <SearchResults query={searchTerm} collection={nfts} />}
                </div>
              </Combobox>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

function useSearchProps(): any {
  let buttonRef = useRef<any>();
  let [open, setOpen] = useState(false);

  return {
    buttonProps: {
      ref: buttonRef,
      onClick() {
        setOpen(true);
      },
    },
    dialogProps: {
      open,
      setOpen(open: any) {
        let { width, height } = (buttonRef.current as any).getBoundingClientRect();
        if (!open || (width !== 0 && height !== 0)) {
          setOpen(open);
        }
      },
    },
  };
}

export function GlobalSearch() {
  let [modifierKey, setModifierKey] = useState<string>();
  let { buttonProps, dialogProps } = useSearchProps();

  useEffect(() => {
    setModifierKey(/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform) ? '⌘' : 'Ctrl ');
  }, []);

  return (
    <div className="contents">
      <button
        type="button"
        className="group flex rounded-full bg-white/90 px-3 py-2 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur transition dark:bg-zinc-800/90 dark:ring-white/10 dark:hover:ring-white/20"
        aria-label="Find something..."
        {...buttonProps}
      >
        <SearchIcon className="h-6 w-6 fill-zinc-100 stroke-zinc-500 transition group-hover:fill-zinc-200 group-hover:stroke-zinc-700 dark:fill-zinc-700 dark:stroke-zinc-500" />
        <kbd className="hidden lg:block text-xs ml-auto text-zinc-400 dark:text-zinc-500">
          <kbd className="font-sans">{modifierKey}</kbd>
          <kbd className="font-sans">K</kbd>
        </kbd>
      </button>
      <SearchDialog {...dialogProps} />
    </div>
  );
}
