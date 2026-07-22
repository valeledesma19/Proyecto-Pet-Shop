"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { useEstaAutenticado, useEsAdmin, useAuthHidratado } from "@/lib/store/auth-store";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const authHidratado = useAuthHidratado();
  const autenticado = useEstaAutenticado();
  const esAdmin = useEsAdmin();

  useEffect(() => {
    if (!authHidratado) return;
    if (!autenticado) {
      router.replace("/login");
    } else if (!esAdmin) {
      router.replace("/");
    }
  }, [authHidratado, autenticado, esAdmin, router]);

  if (!authHidratado || !autenticado || !esAdmin) {
    return <div className="container-content py-24 text-center text-neutral-500">Verificando acceso...</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row">
      <AdminSidebar />
      <div className="flex-1 p-6 lg:p-10">{children}</div>
    </div>
  );
}