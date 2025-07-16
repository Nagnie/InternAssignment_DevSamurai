import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from './app-sidebar.tsx';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="flex-1 flex flex-col">
                <header className="flex h-16 shrink-0 items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <div className="flex-1" />
                </header>
                <div className="flex-1 overflow-auto p-4">
                    {children}
                </div>
            </main>
        </SidebarProvider>
    );
};

export default Layout;