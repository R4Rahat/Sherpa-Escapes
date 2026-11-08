export default function BlankPage({ title = "Page" }) {
  return (
    <div className="space-y-6">
      {/* Page Title & Breadcrumb Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {title}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your {title.toLowerCase()} and configurations here.
          </p>
        </div>
      </div>

      {/* Blank Card Container */}
      <div className="min-h-[460px] rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex items-center justify-center">
        <div className="text-center text-slate-400">
          <p className="text-sm font-medium">{title} content will appear here</p>
        </div>
      </div>
    </div>
  );
}

