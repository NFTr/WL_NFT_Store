import { useState, useEffect } from 'react';

const isGobyInstalled = () => {
  if (typeof window === 'undefined') {
    return false;
  }
  const { chia } = window as any;
  return Boolean(chia && chia.isGoby);
};

export const requestAccounts = async (goby: any) => {
  if (goby.isGobyInstalled) {
    const accounts = await (window as any).chia.request({ method: 'requestAccounts' });
    goby.value.account = accounts?.[0];
    console.log(accounts);
  }
};

export const connect = async (goby: any) => {
  if (goby.isGobyInstalled) {
    try {
      await (window as any).chia.request({ method: 'connect' });
      const publicKeys = await (window as any).chia.request({ method: 'getPublicKeys' });
      console.log(publicKeys);
    } catch (e) {}
  }
};

export const takeOffer = async (goby: any, offer: any) => {
  if (goby.isGobyInstalled) {
    try {
      await (window as any).chia.request({ method: 'takeOffer', params: { offer: offer.offer, fee: 0 } });
    } catch (e) {}
  }
};

export const useGoby = () => {
  const [goby, setGoby] = useState({ account: '', isGobyInstalled: false });

  useEffect(() => {
    const initializeGoby = async () => {
      if (!goby.isGobyInstalled && isGobyInstalled()) {
        setGoby((prevGoby) => ({ ...prevGoby, isGobyInstalled: true }));

        (window as any).chia.on('accountsChanged', (accounts: any) => {
          setGoby((prevGoby) => ({ ...prevGoby, account: accounts?.[0] }));
        });
        (window as any).chia.on('chainChanged', () => window.location.reload());
        const accounts = await (window as any).chia.request({ method: 'accounts' });
        setGoby((prevGoby) => ({ ...prevGoby, account: accounts?.[0] }));
      }
    };
    initializeGoby();
  }, [goby.isGobyInstalled]);

  return {
    goby,
    requestAccounts: () => requestAccounts({ value: goby, setValue: setGoby }),
    takeOffer: (offer: any) => takeOffer({ value: goby, setValue: setGoby }, offer),
    connect: () => connect(goby),
  };
};
