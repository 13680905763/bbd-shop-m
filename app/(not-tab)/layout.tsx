"use client";

export default function NotTabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex h-[100vh] flex-col justify-between bg-white pt-[env(safe-area-inset-top)]">
      {children}
    </section>
  );
}
