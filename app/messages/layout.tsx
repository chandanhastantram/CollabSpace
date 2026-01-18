// Disable static prerendering for this page
export const dynamic = 'force-dynamic';

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
