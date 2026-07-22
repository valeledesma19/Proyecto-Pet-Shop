"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Tags, Award, Users, ClipboardList, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/categorias", label: "Categorías", icon: Tags },
  { href: "/admin/marcas", label: "Marcas", icon: Award },
  { href: "/admin/usuarios", label: "Usuarios", icon: Users },
  { href: "/admin/pedidos", label: "Pedidos", icon: ClipboardList },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 border-b border-border bg-white lg:w-60 lg:border-b-0 lg:border-r">
      <div className="flex flex-col gap-1 p-4 lg:sticky lg:top-20">
        <Link href="/" className="mb-3 flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-sage-700">
          <ArrowLeft className="h-3.5 w-3.5" /> Volver a la tienda
        </Link>

        {links.map((link) => {
          const activo = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium",
                activo ? "bg-sage-100 text-sage-700" : "text-neutral-600 hover:bg-neutral-100"
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}