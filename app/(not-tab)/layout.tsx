"use client";

export default function NotTabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex h-[100dvh] flex-col justify-between bg-[#f5f5f5] pt-[env(safe-area-inset-top)]">
      {children}
    </section>
  );
}
