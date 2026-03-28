export default function LeaderboardLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      {/* Navbar Skeleton */}
      <div className="h-20 w-full border-b-4 border-on-background bg-surface-container animate-pulse mb-12 md:mb-20"></div>

      <div className="flex">
        {/* Sidebar Skeleton */}
        <div className="hidden lg:block w-64 h-screen fixed border-r-4 border-on-background bg-surface-container-low animate-pulse"></div>

        <main className="lg:ml-64 p-6 md:p-12 w-full space-y-16">
          {/* Header Skeleton */}
          <div className="space-y-4">
            <div className="h-16 bg-on-background/10 rounded-2xl w-1/3 animate-pulse"></div>
            <div className="h-4 bg-on-background/5 rounded w-1/4 animate-pulse"></div>
          </div>

          {/* Podium Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-end max-w-5xl mx-auto pt-16">
            <div className="h-48 bg-secondary-container/10 border-4 border-dashed border-on-background/20 rounded-xl animate-pulse"></div>
            <div className="h-64 bg-primary-container/20 border-4 border-dashed border-on-background/20 rounded-2xl animate-pulse scale-110"></div>
            <div className="h-48 bg-tertiary-container/10 border-4 border-dashed border-on-background/20 rounded-xl animate-pulse"></div>
          </div>

          {/* Table Skeleton */}
          <section className="max-w-5xl mx-auto pb-12">
            <div className="h-[400px] bg-surface-container border-4 border-on-background/20 rounded-2xl animate-pulse"></div>
          </section>
        </main>
      </div>
    </div>
  );
}
