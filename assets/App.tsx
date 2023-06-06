import React from 'react';
import {Outlet, ScrollRestoration, useLocation} from 'react-router-dom';
import {Header} from './components/Header';

export const App: React.FC = () => {
    let isHomePage = useLocation().pathname === '/';

    return (
        <>
            <div className="fixed inset-0 flex justify-center sm:px-8">
                <div className="flex w-full max-w-7xl lg:px-8">
                    <div
                        className={isHomePage ? "w-full bg-white ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-300/20" : 'w-full'}/>
                </div>
            </div>
            <div className="relative">
                <Header/>
                <main>
                    <Outlet/>
                </main>
                {/*<Footer />*/}
            </div>
            <ScrollRestoration/>
        </>
    );
};
