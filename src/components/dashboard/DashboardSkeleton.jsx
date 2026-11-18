// Placeholder shown in the dashboard content area while the profile is loading
const Bar = ({ className = "" }) => <div className={`bg-slate-200 rounded ${className}`} />;

export default function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-6" aria-busy="true" aria-label="Loading dashboard">
      {/* Greeting */}
      <div className="space-y-3">
        <Bar className="h-8 w-64 max-w-full" />
        <Bar className="h-4 w-80 max-w-full !bg-slate-100" />
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center justify-between">
            <div className="space-y-3">
              <Bar className="h-4 w-24 !bg-slate-100" />
              <Bar className="h-8 w-12" />
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-100" />
          </div>
        ))}
      </div>

      {/* Recent orders + profile card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-5 space-y-4">
          <Bar className="h-5 w-40" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between gap-4 pt-4 border-t border-slate-100">
              <Bar className="h-4 w-20" />
              <Bar className="h-4 w-1/3 !bg-slate-100" />
              <div className="h-6 w-20 rounded-full bg-slate-200" />
              <Bar className="h-4 w-14" />
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="h-24 bg-slate-200" />
          <div className="p-6 pt-0">
            <div className="w-20 h-20 rounded-full bg-slate-300 border-4 border-white -mt-10" />
            <div className="mt-4 space-y-3">
              <Bar className="h-5 w-32" />
              <Bar className="h-4 w-44 !bg-slate-100" />
              <Bar className="h-4 w-36 !bg-slate-100" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
