export default function Loading() {
  return (
    <div className="luxury-page py-12">
      <div className="relative container-page">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="luxury-loading h-80 rounded-md border border-gold/15"
          />
        ))}
      </div>
      </div>
    </div>
  );
}
