import { AlertTriangle, Info } from "lucide-react";

const ErrorState = ({ type, message, suggestion }) => {
  return (
    <div className="w-full py-6">
      <div className="rounded-lg bg-gradient-to-br from-red-50 to-red-100/50 p-5 border border-red-200 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <div className="rounded-full bg-red-100 p-2">
              <AlertTriangle className="h-5 w-5 text-red-600" strokeWidth={2} />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-red-900 mb-1">
              {type === "no-series" ?
                "No Exam Series Selected"
              : "Missing Grade Configuration"}
            </h3>
            <p className="text-sm text-red-800 leading-relaxed mb-2">
              {message}
            </p>
            {suggestion && (
              <div className="flex items-start gap-2 mt-3 pt-3 border-t border-red-200/60">
                <Info
                  className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5"
                  strokeWidth={2}
                />
                <p className="text-sm text-red-700/90 leading-relaxed">
                  {suggestion}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;
