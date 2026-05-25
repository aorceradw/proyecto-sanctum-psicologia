export function LoadingSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-surface-variant rounded-lg"
          style={{ width: `${100 - i * 15}%` }}
        />
      ))}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-secondary animate-spin" />
      <p className="text-sm text-on-surface-variant">Cargando...</p>
    </div>
  );
}
