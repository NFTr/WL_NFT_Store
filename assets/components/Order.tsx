import React, { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { DropdownSVG } from './Icons';

export const Order: React.FC<{ orderTerm: string; setOrderTerm: (term: string) => void }> = ({
  orderTerm,
  setOrderTerm,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const orders = [
    { set: () => setOrderTerm('&order%5Bid%5D=asc'), label: 'ID ascending' },
    { set: () => setOrderTerm('&order%5Bid%5D=desc'), label: 'ID descending' },
    { set: () => setOrderTerm('&order%5Bname%5D=asc'), label: 'Name ascending' },
    { set: () => setOrderTerm('&order%5Bname%5D=desc'), label: 'Name descending' },
    { set: () => setOrderTerm('&order%5BlowestSellOffer.xchPrice%5D=asc'), label: 'Price ascending' },
    { set: () => setOrderTerm('&order%5%5BlowestSellOffer.xchPrice%5D=desc'), label: 'Price descending' },
  ];
  return (
    <div className="relative z-10">
      <Menu>
        {({ open }) => (
          <>
            <Menu.Button
              className="flex items-center gap-2 rounded-lg bg-white/90 pt-2 pb-1 pl-5 pr-3 text-lg font-bold text-zinc-800 shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10"
              onClick={() => setIsOpen(!isOpen)}
            >
              Order
              <div
                className={
                  open
                    ? 'rotate-180 transition-transform duration-300 ease-in-out'
                    : 'transition-transform duration-300 ease-in-out'
                }
              >
                <DropdownSVG></DropdownSVG>
              </div>
            </Menu.Button>
            <Transition
              show={isOpen}
              enter="transition duration-200 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <div className="absolute">
                <div className="" onClick={() => setIsOpen(false)}></div>
                <div className="mt-3 min-w-max rounded-md bg-white/90 px-5 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:bg-zinc-800/90 dark:ring-white/10">
                  <Menu.Items>
                    {orders.map((order) => (
                      <Menu.Item key={order.label} as={Fragment}>
                        {({ active }) => (
                          <div
                            onClick={() => {
                              order.set();
                              setIsOpen(false);
                            }}
                            className={`${
                              active ? 'text-zinc-800 dark:text-zinc-200' : ' text-zinc-500 dark:text-zinc-400'
                            }  py-2 text-lg  font-bold `}
                          >
                            {order.label}
                          </div>
                        )}
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </div>
              </div>
            </Transition>
          </>
        )}
      </Menu>
    </div>
  );
};
