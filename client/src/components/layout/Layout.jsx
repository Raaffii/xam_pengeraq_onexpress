import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useState } from "react";
import Sidebar from "../../components/layout/Sidebar";

export const Layout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <div className='min-h-screen w-auto bg-gray-50'>
      <div className='fixed top-0 left-0 h-screen z-50'>
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </div>
      <div
        className={`transition-all duration-300 ${
          isCollapsed ? "ml-20" : "ml-64"
        }`}>
        <main className='p-4'>
          <section className='bg-white rounded-sm shadow-sm min-h-screen p-4'>
            <Outlet />
          </section>
        </main>
      </div>
    </div>
  );
};

export default Layout;
