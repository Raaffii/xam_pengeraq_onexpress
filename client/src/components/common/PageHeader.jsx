import { Plus } from "lucide-react";

export default function PageHeader({
  title,
  subtitle,
  actions = [],
  primaryAction,
  className = "",
}) {
  return (
    <div className={`bg-white border-b border-gray-200 ${className}`}>
      <div className='px-4 sm:px-6 py-6'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          {/* Title Section */}
          <div className='flex-1 min-w-0'>
            <h1 className='text-2xl font-bold text-gray-900 tracking-tight'>
              {title}
            </h1>
            {subtitle && (
              <p className='mt-1 text-sm text-gray-500'>{subtitle}</p>
            )}
          </div>

          {/* Actions Section */}
          <div className='flex flex-col sm:flex-row gap-3 sm:gap-2'>
            {/* Secondary Actions */}
            {actions.map((action, index) => (
              <button
                key={index}
                type='button'
                className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg border transition-colors duration-200 ${
                  action.variant === "outline"
                    ? "border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-gray-500"
                    : action.variant === "danger"
                    ? "border-red-600 text-red-600 bg-white hover:bg-red-50 focus:ring-red-500"
                    : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-gray-500"
                } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                onClick={action.onClick}
                disabled={action.disabled}>
                {action.icon && (
                  <action.icon className='h-4 w-4 mr-2' aria-hidden='true' />
                )}
                {action.label}
              </button>
            ))}

            {/* Primary Action */}
            {primaryAction && (
              <>
                {primaryAction.component ? (
                  // Render custom component
                  primaryAction.component
                ) : (
                  // Render standard button
                  <button
                    type='button'
                    className='inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200'
                    onClick={primaryAction.onClick}
                    disabled={primaryAction.disabled}>
                    {primaryAction.icon ? (
                      <primaryAction.icon
                        className='h-4 w-4 mr-2'
                        aria-hidden='true'
                      />
                    ) : (
                      <Plus className='h-4 w-4 mr-2' aria-hidden='true' />
                    )}
                    {primaryAction.label}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
