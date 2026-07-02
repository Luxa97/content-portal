export function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-md border border-dashed border-line bg-white p-8 text-center text-sm text-gray-600">
      {text}
    </div>
  );
}
