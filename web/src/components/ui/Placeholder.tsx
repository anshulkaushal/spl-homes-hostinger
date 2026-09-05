export function Placeholder({ children }: { children: React.ReactNode }) {
  return (
    <p className="border border-dashed border-stone bg-paper-2 px-4 py-3 text-sm text-ink-soft">
      {children}
    </p>
  );
}
