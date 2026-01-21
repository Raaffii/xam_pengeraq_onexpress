import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  Folder,
  Home,
  Inbox,
  Users,
  GraduationCap,
  FileText,
  UserCircle,
  ClipboardList,
  Calendar,
} from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";

export const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, loading } = useAuth();

  let navigation;
  if (!loading) {
    if (user.role === "admin") {
      navigation = [
        { name: "Dashboard", href: "/", icon: Home },
        { name: "Schedule", href: "/schedule", icon: Calendar },
        { name: "Students", href: "/students", icon: Users },
        { name: "Teacher", href: "/teachers", icon: GraduationCap },
        { name: "Exams", href: "/exams", icon: ClipboardList },
        { name: "Series", href: "/series", icon: Folder },
        { name: "Subjects", href: "/subjects", icon: FileText },
        { name: "Users", href: "/users", icon: UserCircle },
        { name: "Transcripts", href: "/transcripts", icon: Inbox },
      ];
    } else if (user.role === "teacher") {
      navigation = [
        { name: "Dashboard", href: "/", icon: Home },
        { name: "Schedule", href: "/teacher/schedule", icon: Calendar },
      ];
    }
  }

  const location = useLocation();
  const pathname =
    location.pathname === "/" ? "" : location.pathname.split("/")[1];

  const SidebarContent = () => (
    <div className='flex min-h-0 flex-1 flex-col bg-gradient-to-b from-gray-800 to-gray-900'>
      {/* Header */}
      <div className='flex h-16 flex-shrink-0 items-center bg-gray-900 px-4 shadow-lg border-b border-gray-700'>
        <div className='flex items-baseline'>
          <h1 className='text-2xl font-extrabold italic text-white tracking-wide'>
            {import.meta.env.VITE_APP_NAME_SHORT || "Prime"}
          </h1>
          <span className='text-sm font-medium italic text-gray-300 ml-2 mt-1'>
            {import.meta.env.VITE_APP_NAME_SUFFIX || "Exams"}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className='flex flex-1 flex-col overflow-y-auto'>
        <nav className='flex-1 space-y-2 px-3 py-6'>
          {navigation.map((item) => {
            const isCurrent =
              item.href === "/"
                ? pathname === ""
                : pathname === item.href.split("/")[1];
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95",
                  isCurrent
                    ? "bg-gray-900 text-white shadow-md border-l-4 border-blue-400"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white hover:shadow-sm",
                )}
                onClick={() => setIsOpen(false)}>
                <Icon
                  className={cn(
                    "mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-200",
                    isCurrent
                      ? "text-blue-400"
                      : "text-gray-400 group-hover:text-gray-300",
                  )}
                  aria-hidden='true'
                />
                <span className='truncate'>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className='flex-shrink-0 px-3 py-4 border-t border-gray-700'>
          <div className='text-xs text-gray-400 text-center'>
            © {new Date().getFullYear()}{" "}
            {import.meta.env.VITE_APP_NAME_SHORT || "Prime"} System
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className='hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col md:z-40'>
        <SidebarContent />
      </div>

      {/* Mobile sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side='left' className='p-0 w-64 bg-transparent border-0'>
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
};
