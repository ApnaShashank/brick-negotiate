export default function GameLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      {/* Navbar Skeleton */}
      <div className="h-20 w-full border-b-4 border-on-background bg-surface-container animate-pulse mb-12 md:mb-20"></div>

      <main className="px-4 md:px-8 max-w-6xl mx-auto w-full space-y-12">
        {/* Header Skeleton */}
        <div className="text-center space-y-4">
          <div className="h-16 bg-on-background/10 rounded-2xl w-1/3 mx-auto animate-pulse"></div>
          <div className="h-4 bg-on-background/5 rounded w-1/4 mx-auto animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Selection Skeleton */}
          <section className="space-y-6">
            <div className="h-8 bg-on-background/5 rounded-lg w-1/2 animate-pulse"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-surface-container-low border-4 border-on-background/10 rounded-xl animate-pulse"></div>
              ))}
            </div>
          </section>

          {/* Personality Selection Skeleton */}
          <section className="space-y-6">
            <div className="h-8 bg-on-background/5 rounded-lg w-1/2 animate-pulse"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-surface-container-low border-4 border-on-background/10 rounded-xl animate-pulse"></div>
              ))}
            </div>
            <div className="h-20 bg-on-background/20 rounded-2xl mt-8 animate-pulse"></div>
          </section>
        </div>
      </main>
    </div>
  );
}
