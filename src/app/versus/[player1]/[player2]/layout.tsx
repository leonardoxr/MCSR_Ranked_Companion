// Server component for static export compatibility
export function generateStaticParams() {
  // Return at least one param so Next.js can generate a static page
  // Client-side routing will handle actual dynamic routes
  return [{ player1: 'placeholder', player2: 'placeholder' }];
}

export default function VersusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

