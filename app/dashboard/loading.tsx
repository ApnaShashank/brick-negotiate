export default function DashboardLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      {/* Navbar Skeleton Placeholder */}
      <div className="h-20 w-full border-b-4 border-on-background bg-surface-container animate-pulse mb-20"></div>

      <div className="flex">
        {/* Sidebar Skeleton */}
        <div className="hidden lg:block w-64 h-screen fixed border-r-4 border-on-background bg-surface-container-low animate-pulse"></div>

        <main className="lg:ml-64 p-6 md:p-12 w-full space-y-12">
          {/* Header Skeleton */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-4 w-1/3">
              <div className="h-12 bg-on-background/10 rounded-xl w-3/4 animate-pulse"></div>
              <div className="h-4 bg-on-background/5 rounded w-1/2 animate-pulse"></div>
            </div>
            <div className="w-48 h-20 bg-primary-container/20 border-4 border-dashed border-on-background/20 rounded-2xl animate-pulse"></div>
          </div>

          {/* Stats Bar Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-surface-container border-4 border-on-background/10 rounded-xl animate-pulse delay-75"></div>
            ))}
          </div>

          {/* Display Case Skeleton */}
          <section className="space-y-6">
            <div className="h-8 bg-on-background/5 rounded-lg w-1/4 animate-pulse"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-square bg-surface-container-highest border-4 border-on-background/5 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
