import React from 'react';
import {SidebarInset, SidebarProvider, SidebarTrigger} from '@/components/ui/sidebar';
import AppSidebar from './app-sidebar.tsx';
import { Separator } from "@/components/ui/separator"

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="bg-sidebar flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />
                    </div>
                </header>
                <main className="flex-1 flex flex-col">
                    <div className="flex-1 overflow-auto p-4">
                        {children}
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default Layout;