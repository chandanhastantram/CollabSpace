// Disable static generation for meeting page
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default function MeetingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
