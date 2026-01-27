import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";

export default function PageHeader({
  title,
  subtitle,
  actions = [],
  actions2 = [],
  actionDropDown = [],
  primaryAction,
  childrenCustom,
  children,
  showSearch = false,
  searchPlaceholder = "Search...",
  onSearch,
  searchMaxLength = 50,
  searchDebounceMs = 500,
  searchMinLength = 3,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const typingTimeoutRef = useRef(null);

  const handleSearchChange = (e) => {
    const search = e.target.value;
    setSearchQuery(search);
    const words = search.length;

    if (words >= searchMinLength || words === 0) {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        onSearch?.(search);
      }, searchDebounceMs);
    }
  };

  return (
    <div className='space-y-4 mb-6'>
      {/* Header Content */}
      <div className='flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4'>
        {/* Title Section */}
        <div className='flex-1 min-w-0 space-y-1'>
          <h1 className='text-3xl font-bold tracking-tight text-foreground'>
            {title}
          </h1>
          {subtitle && (
            <p className='text-sm text-muted-foreground max-w-2xl'>
              {subtitle}
            </p>
          )}
        </div>

        {/* Actions Section */}
        {(actions.length > 0 || primaryAction) && (
          <div className='flex flex-wrap items-center gap-2 flex-shrink-0'>
            {/* Secondary Actions */}
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || "outline"}
                size={action.size || "default"}
                onClick={action.onClick}
                disabled={action.disabled}
                className={`w-full sm:w-auto h-10 py-4 ${action.className}`}>
                {action.icon && <action.icon className='mr-2 h-4 w-4' />}
                {action.label}
              </Button>
            ))}

            {/* Primary Action */}
            {primaryAction && (
              <>
                {primaryAction.component ? (
                  primaryAction.component
                ) : (
                  <Button
                    variant={primaryAction.variant || "default"}
                    size={primaryAction.size || "default"}
                    onClick={primaryAction.onClick}
                    disabled={primaryAction.disabled}
                    className={`w-full sm:w-auto h-10 ${primaryAction.className}`}>
                    {primaryAction.icon ? (
                      <primaryAction.icon className='mr-2 h-4 w-4' />
                    ) : (
                      <Plus className='mr-2 h-4 w-4' />
                    )}
                    {primaryAction.label}
                  </Button>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Filters and Search Section */}
      {(childrenCustom || children || showSearch || actions2) && (
        <div className='flex flex-wrap items-center gap-2 flex-shrink-0 justify-end'>
          <div className='flex-1 min-w-0'>
            <div className='flex gap-1'>
              {children}
              {actions2.length > 0 && (
                <div className='flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:gap-2'>
                  {actions2.map((action, index) => (
                    <button
                      key={index}
                      type='button'
                      className={`inline-flex items-center justify-center px-3 py-2 border rounded-lg text-sm font-medium transition-colors duration-200 ${
                        action.variant === "primary"
                          ? "border-blue-600 text-white bg-blue-600 hover:bg-blue-700"
                          : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                      onClick={action.onClick}
                      disabled={action.disabled}>
                      {action.icon && (
                        <action.icon
                          className='h-4 w-4 mr-2'
                          aria-hidden='true'
                        />
                      )}
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
              {childrenCustom}
            </div>
          </div>

          {/* Search Bar */}
          {showSearch && (
            <div className='relative w-full sm:w-auto sm:min-w-[280px] md:min-w-[320px]'>
              <div className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500'>
                <Search className='h-4 w-4' />
              </div>
              <Input
                type='search'
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={handleSearchChange}
                maxLength={searchMaxLength}
                className='pl-9 w-full bg-white border-gray-300 h-10 text-sm focus:ring-2 focus:ring-gray-700 focus:border-gray-700'
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
