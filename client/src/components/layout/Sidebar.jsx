import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserInitials } from "@/utils";
import { useAuth } from "@/providers/AuthProvider";
import { Calendar, LayoutDashboard, Users } from "lucide-react";
import PropTypes from "prop-types";

export const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { path: "/", label: "Home", icon: LayoutDashboard },
    { path: "/students", label: "Student", icon: Users },
    { path: "/profile", label: "Schedule", icon: Calendar },
    {
      label: "Setup",
      icon: Calendar,
      dropdown: [
        { path: "/setup/menu1", label: "Menu 1" },
        { path: "/setup/menu2", label: "Menu 2" },
        { path: "/setup/menu3", label: "Menu 3" },
      ],
    },
  ];

  if (!user) return null;

  return (
    <>
      {/* Sidebar */}
      <div
        className={`top-0 left-0 h-screen bg-primarygray  border-r border-gray-800 shadow-xl flex flex-col gap-10  justify-between transition-all duration-300 z-50
        ${isCollapsed ? "w-20" : "w-64"}`}>
        {/* Logo Section */}
        <div className='p-4 flex items-center justify-between border-b border-gray-800 font-sans italic bg-black/50'>
          <span
            className={`text-2xl text-white transition-all justify-center w-full flex ${
              isCollapsed ? "block" : "block"
            }`}>
            {isCollapsed ? "Pgq" : "Pengeraq Exam"}
          </span>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className='text-gray-300 hover:text-emerald-400'>
            {isCollapsed ? "»" : "«"}
          </button>
        </div>

        {/* Navigation */}
        <div className='flex flex-col flex-1 py-4 gap-1'>
          {navItems?.map((item) => {
            const IconComponent = item.icon;
            const isActive = item.path && location.pathname === item.path;

            const isDropdownActive =
              item.dropdown &&
              location.pathname.startsWith(
                item.dropdown[0].path.split("/").slice(0, -1).join("/")
              );

            const baseClass =
              "h-10 w-full flex items-center transition-colors duration-200";

            const spacingClass = isCollapsed
              ? "justify-center px-0"
              : "justify-between px-4";

            const stateClass =
              isActive || isDropdownActive
                ? "bg-lightgreenprime/50 text-white"
                : "text-gray-200 hover:bg-lightgreenprime/60";

            // ================= DROPDOWN =================
            if (item.dropdown) {
              return (
                <div key={item.label} className='px-3 mb-1'>
                  <button
                    onClick={() =>
                      setOpenDropdown(
                        openDropdown === item.label ? null : item.label
                      )
                    }
                    className={`${baseClass} ${spacingClass} ${stateClass} rounded-md hover:bg-primaryblue`}>
                    <div className='flex items-center gap-3'>
                      {IconComponent && <IconComponent size={20} />}
                      {!isCollapsed && (
                        <span className='text-sm font-medium'>
                          {item.label}
                        </span>
                      )}
                    </div>

                    {!isCollapsed && (
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${
                          openDropdown === item.label ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>

                  {!isCollapsed && openDropdown === item.label && (
                    <div className='mt-1 ml-6 space-y-1'>
                      {item.dropdown.map((sub) => (
                        <Link
                          key={sub.path}
                          to={sub.path}
                          className='block h-9 px-4 flex items-center rounded-md text-sm
                text-gray-300 hover:bg-lightgreenprime/40'>
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            // ================= LINK =================
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 mb-1 block`}>
                <div
                  className={`${baseClass} ${spacingClass} ${stateClass} rounded-md hover:border p-5 border-primaryblue hover:border-l-8 ${
                    isActive ? "border border-l-8" : ""
                  }`}>
                  <div className='flex items-center gap-3'>
                    {IconComponent && <IconComponent size={20} />}
                    {!isCollapsed && (
                      <span className='text-sm font-medium'>{item.label}</span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Profile Section */}
        <div className='p-4 border-t border-gray-800'>
          <div className='flex items-center space-x-3 justify-between'>
            <div className='flex gap-2 items-center'>
              <Avatar className='h-9 w-9 ring-2 ring-gray-800 group-hover:ring-emerald-400 transition-all duration-200'>
                <AvatarImage src='/api/placeholder/32/32' alt='Profile' />
                <AvatarFallback className='bg-gray-300 text-black text-sm'>
                  {getUserInitials(user?.userName || "User")}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <p className='text-verylightgreenprime'>{user?.name}</p>
              )}

              {!isCollapsed && (
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-medium text-gray-200 truncate'>
                    {user?.userName}
                  </p>
                  <p className='text-xs text-gray-400 truncate'>
                    {user?.email}
                  </p>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <div>
                <div className='flex space-x-2 mt-1'>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='text-gray-300 hover:text-red-400'
                    onClick={handleLogout}>
                    <LogOut size={14} />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

Sidebar.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
  setIsCollapsed: PropTypes.func.isRequired,
};

export default Sidebar;
