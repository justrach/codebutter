'use client';

export default function DashboardClient({ userId }: { userId: string }) {
  return <div>{JSON.stringify(userId)}</div>;
}
