import { Outlet } from 'react-router-dom';
import { UserRole } from '@/core/constants';
import Sidebar from './Sidebar';
import Header from './Header';
import { SidebarProvider, useSidebar } from './SidebarContext';
import clsx from 'clsx';

interface DashboardLayoutProps {
  role: UserRole;
}

const DashboardContent = ({ role }: DashboardLayoutProps) => {
  const { isCollapsed, isMobile } = useSidebar();

  return (
    <>
      <Sidebar role={role} />
      <div 
        className={clsx(
          'flex-1 flex flex-col transition-all duration-300 ease-in-out',
          isCollapsed && !isMobile ? 'ml-16' : 'ml-64'
        )}
      >
        <Header />
        <main className="flex-1 p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </>
  );
};

const DashboardLayout = ({ role }: DashboardLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-br from-grey-50 to-grey-100 flex">
        <DashboardContent role={role} />
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;

