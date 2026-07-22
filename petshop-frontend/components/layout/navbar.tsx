"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { PawPrint, Heart, User, LogOut, Package, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { CarritoBadge } from "@/components/layout/carrito-badge";
import { NavbarSearch } from "@/components/layout/navbar-search";
import { useAuthStore, useEsAdmin } from "@/lib/store/auth-store";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Productos" },
  { href: "/categorias", label: "Categorias" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export function Navbar() {
  const router = useRouter();
  const usuario = useAuthStore((state) => state.usuario);
  const logout = useAuthStore((state) => state.logout);
  const esAdmin = useEsAdmin();

  function handleLogout() {
    logout();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white">
      <div className="container-content flex h-20 items-center justify-between gap-6">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sage-500 text-white">
            <PawPrint className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-foreground">
            Huellitas
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-neutral-600 hover:text-sage-700"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
                  <NavbarSearch />
                  <Button variant="ghost" size="icon" aria-label="Favoritos" className="hidden sm:inline-flex" asChild>
            <Link href="/favoritos">
              <Heart />
            </Link>
          </Button>
          <CarritoBadge />

          {usuario ? (
            <div className="ml-2 hidden items-center border-l border-border pl-3 md:flex">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sage-100 text-xs font-semibold text-sage-700">
                      {usuario.nombre.charAt(0).toUpperCase()}
                    </span>
                    {usuario.nombre}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>{usuario.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/perfil">
                      <User className="h-4 w-4" /> Mi perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/pedidos">
                      <Package className="h-4 w-4" /> Mis pedidos
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/favoritos">
                      <Heart className="h-4 w-4" /> Favoritos
                    </Link>
                  </DropdownMenuItem>
                  {esAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin">
                          <LayoutDashboard className="h-4 w-4" /> Panel de administración
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={handleLogout} className="text-destructive focus:bg-destructive/10">
                    <LogOut className="h-4 w-4" /> Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="ml-2 hidden items-center gap-2 border-l border-border pl-3 md:flex">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Iniciar sesión</Link>
              </Button>
              <Button variant="default" size="sm" asChild>
                <Link href="/registro">Registrarse</Link>
              </Button>
            </div>
          )}

          <Button variant="ghost" size="icon" aria-label="Mi cuenta" className="md:hidden" asChild>
            <Link href={usuario ? "/perfil" : "/login"}>
              <User />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
