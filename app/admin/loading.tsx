export default function AdminLoading() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="luxury-loading h-28 rounded-md border border-gold/15"
        />
      ))}
    </div>
  );
}
