
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#f5f5f5]">
      {/* Sidebar untuk seluruh halaman admin */}
      <Sidebar />

      {/* Konten halaman sesuai menu sidebar */}
      <div className="min-w-0 flex-1">
        {children}
      </div>
    </div>
  );
}
