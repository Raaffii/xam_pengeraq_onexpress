import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, User, X, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserInitials } from "@/utils";
import { useAuth } from "@/providers/AuthProvider";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [educationDropdownOpen, setEducationDropdownOpen] = useState(false);
  const [setupDropdownOpen, setSetupDropdownOpen] = useState(false);

  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/profile", label: "Profile" },
    {
      label: "Setup",
      dropdown: [
        { path: "/setup/menu1", label: "Menu 1" },
        { path: "/setup/menu2", label: "Menu 2" },
        { path: "/setup/menu3", label: "Menu 3" },
      ],
    },
  ];

  // Don't render navbar if user is not authenticated
  if (!user) return null;

  return (
    <nav className="bg-gradient-to-r from-black to-black border-b border-gray-800 shadow-xl">
      <div className="max-w-[1920px] mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex-shrink-0 transition-transform hover:scale-105"
          >
            <span className="text-2xl font-bold text-emerald-400">Logo</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 ml-auto">
            {navItems.map((item) =>
              item.dropdown ? (
                <div className="relative group" key={item.label}>
                  <button
                    className={`flex items-center space-x-1 px-4 py-2 rounded-md text-md font-medium transition-all duration-200 ${
                      location.pathname.startsWith(
                        item.dropdown[0].path.split("/").slice(0, -1).join("/"),
                      )
                        ? "text-emerald-400 bg-black"
                        : "text-gray-200 hover:text-emerald-400"
                    }`}
                    onClick={() =>
                      item.label === "Education"
                        ? setEducationDropdownOpen(!educationDropdownOpen)
                        : setSetupDropdownOpen(!setupDropdownOpen)
                    }
                  >
                    <span>{item.label}</span>
                    <ChevronDown size={16} className="ml-1" />
                  </button>
                  <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 right-0 mt-1 w-48 bg-black rounded-md shadow-lg transition-all duration-200 z-50 border border-gray-800">
                    {item.dropdown.map((subItem) => (
                      <Link
                        key={subItem.path}
                        to={subItem.path}
                        className={`block px-4 py-2 text-md transition-colors rounded-md duration-200 ${
                          location.pathname === subItem.path
                            ? "text-emerald-400 bg-gray-900"
                            : "text-gray-200 hover:text-emerald-400 hover:bg-gray-900"
                        }`}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-2 rounded-md text-md font-medium transition-all duration-200 ${
                    location.pathname === item.path
                      ? "text-emerald-400 bg-gray-900"
                      : "text-gray-200 hover:text-emerald-400 hover:bg-gray-900"
                  }`}
                >
                  {item.label}
                </Link>
              ),
            )}

            {/* Profile Section */}
            <div className="relative ml-4">
              <div
                className="flex items-center cursor-pointer group"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <Avatar className="h-9 w-9 ring-2 ring-gray-800 group-hover:ring-emerald-400 transition-all duration-200">
                  <AvatarImage src="/api/placeholder/32/32" alt="Profile" />
                  <AvatarFallback className="bg-gray-900 text-gray-200 text-sm">
                    {getUserInitials(user?.userName || "User")}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-2 hidden lg:block">
                  <p className="text-sm font-medium text-gray-200">
                    {user?.userName || "User"}
                  </p>
                  <p className="text-xs text-gray-400">{user?.email || ""}</p>
                </div>
                <ChevronDown
                  size={16}
                  className="ml-1 text-gray-400 group-hover:text-emerald-400 transition-colors duration-200"
                />
              </div>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-black rounded-md shadow-lg z-50 border border-gray-800 py-1">
                  {/* User Info in Dropdown */}
                  <div className="px-4 py-3 border-b border-gray-800">
                    <p className="text-sm font-medium text-gray-200">
                      {user?.userName}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {user?.email}
                    </p>
                    {user?.studentId && (
                      <p className="text-xs text-gray-500 mt-1">
                        ID: {user.studentId}
                      </p>
                    )}
                  </div>

                  <div className="py-1">
                    <Button
                      variant="ghost"
                      className="w-full flex items-center space-x-2 justify-start text-gray-200 hover:text-emerald-400 hover:bg-gray-900 rounded-none"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        navigate("/profile");
                      }}
                    >
                      <User size={16} className="shrink-0" />
                      <span>My Profile</span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full flex items-center space-x-2 justify-start text-gray-200 hover:text-red-400 hover:bg-gray-900 rounded-none"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        handleLogout();
                      }}
                    >
                      <LogOut size={16} className="shrink-0" />
                      <span>Logout</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-200 hover:text-emerald-400 hover:bg-gray-900 transition-colors duration-200"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-800 bg-black">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* User Info Mobile */}
            <div className="px-4 py-3 mb-2 bg-gray-900 rounded-md">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10 ring-2 ring-gray-800">
                  <AvatarImage src="/api/placeholder/32/32" alt="Profile" />
                  <AvatarFallback className="bg-gray-900 text-gray-200">
                    {getUserInitials(user?.userName || "User")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-200 truncate">
                    {user?.userName}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Items */}
            {navItems.map((item) =>
              item.dropdown ? (
                <div key={item.label} className="space-y-1">
                  <button
                    className="w-full flex items-center justify-between px-4 py-2 rounded-md text-sm font-medium text-gray-200 hover:text-emerald-400 hover:bg-gray-900 transition-colors duration-200"
                    onClick={() => {
                      if (item.label === "Education") {
                        setEducationDropdownOpen(!educationDropdownOpen);
                      } else {
                        setSetupDropdownOpen(!setupDropdownOpen);
                      }
                    }}
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        (item.label === "Education" && educationDropdownOpen) ||
                        (item.label === "Setup" && setupDropdownOpen)
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </button>
                  {((item.label === "Education" && educationDropdownOpen) ||
                    (item.label === "Setup" && setupDropdownOpen)) && (
                    <div className="pl-4 space-y-1">
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.path}
                          to={subItem.path}
                          className={`block px-4 py-2 rounded-md text-sm transition-colors duration-200 ${
                            location.pathname === subItem.path
                              ? "text-emerald-400 bg-gray-900"
                              : "text-gray-200 hover:text-emerald-400 hover:bg-gray-900"
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    location.pathname === item.path
                      ? "text-emerald-400 bg-gray-900"
                      : "text-gray-200 hover:text-emerald-400 hover:bg-gray-900"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ),
            )}

            {/* Mobile Actions */}
            <div className="border-t border-gray-800 pt-2 mt-2">
              <Button
                variant="ghost"
                className="w-full flex items-center space-x-2 justify-start text-gray-200 hover:text-emerald-400 hover:bg-gray-900 rounded-md"
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate("/profile");
                }}
              >
                <User size={16} className="shrink-0" />
                <span>My Profile</span>
              </Button>
              <Button
                variant="ghost"
                className="w-full flex items-center space-x-2 justify-start text-gray-200 hover:text-red-400 hover:bg-gray-900 rounded-md"
                onClick={() => {
                  setIsMenuOpen(false);
                  handleLogout();
                }}
              >
                <LogOut size={16} className="shrink-0" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
