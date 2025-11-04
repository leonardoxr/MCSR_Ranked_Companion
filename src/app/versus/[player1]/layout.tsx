// Server component for static export compatibility
export function generateStaticParams() {
  // Return empty array for client-side only routing
  return [];
}

export default function VersusPlayer1Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

