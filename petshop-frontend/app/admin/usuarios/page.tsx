"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Search, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/store/auth-store";
import type { PageResponse, Usuario } from "@/lib/types";

const TAMANO_PAGINA = 10;

interface EdicionUsuario {
  activo: boolean;
  esAdmin: boolean;
}

export default function AdminUsuariosPage() {
  const usuarioActualId = useAuthStore((state) => state.usuario?.id);

  const [resultado, setResultado] = useState<PageResponse<Usuario> | null>(null);
  const [buscar, setBuscar] = useState("");
  const [pagina, setPagina] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [ediciones, setEdiciones] = useState<Record<number, EdicionUsuario>>({});
  const [guardandoId, setGuardandoId] = useState<number | null>(null);

  async function cargar() {
    setCargando(true);
    try {
      const { data } = await api.get<PageResponse<Usuario>>("/admin/usuarios", {
        params: { buscar: buscar || undefined, page: pagina, size: TAMANO_PAGINA },
      });
      setResultado(data);
      const inicial: Record<number, EdicionUsuario> = {};
      data.content.forEach((u) => {
        inicial[u.id] = { activo: u.activo, esAdmin: u.roles.includes("ROLE_ADMIN") };
      });
      setEdiciones(inicial);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagina]);

  function handleBuscarSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPagina(0);
    cargar();
  }

  async function handleGuardar(usuario: Usuario) {
    const edicion = ediciones[usuario.id];
    setGuardandoId(usuario.id);
    try {
      await api.put(`/admin/usuarios/${usuario.id}`, {
        activo: edicion.activo,
        roles: edicion.esAdmin ? ["ROLE_USER", "ROLE_ADMIN"] : ["ROLE_USER"],
      });
      cargar();
    } finally {
      setGuardandoId(null);
    }
  }

  return (
    <div>
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Usuarios</h1>
        <p className="mt-1 text-sm text-neutral-600">{resultado?.totalElements ?? "…"} usuarios</p>
      </div>

      <form onSubmit={handleBuscarSubmit} className="mt-6 flex max-w-sm gap-2">
        <Input
          placeholder="Buscar por nombre o email..."
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
        />
        <Button type="submit" variant="outline" size="icon" aria-label="Buscar">
          <Search className="h-4 w-4" />
        </Button>
      </form>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-neutral-50 text-left text-xs uppercase tracking-wide text-neutral-500">
            <tr>
              <th className="px-4 py-3">Usuario</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Activo</th>
              <th className="px-4 py-3">Administrador</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {cargando && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-neutral-500">
                  Cargando...
                </td>
              </tr>
            )}
            {!cargando &&
              resultado?.content.map((usuario) => {
                const edicion = ediciones[usuario.id];
                const esUnoMismo = usuario.id === usuarioActualId;
                return (
                  <tr key={usuario.id}>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {usuario.nombre} {usuario.apellido}
                      {esUnoMismo && <Badge variant="muted" className="ml-2">Vos</Badge>}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">{usuario.email}</td>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-neutral-300"
                        disabled={esUnoMismo}
                        checked={edicion?.activo ?? false}
                        onChange={(e) =>
                          setEdiciones((prev) => ({
                            ...prev,
                            [usuario.id]: { ...prev[usuario.id], activo: e.target.checked },
                          }))
                        }
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-neutral-300"
                        disabled={esUnoMismo}
                        checked={edicion?.esAdmin ?? false}
                        onChange={(e) =>
                          setEdiciones((prev) => ({
                            ...prev,
                            [usuario.id]: { ...prev[usuario.id], esAdmin: e.target.checked },
                          }))
                        }
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={esUnoMismo || guardandoId === usuario.id}
                        onClick={() => handleGuardar(usuario)}
                      >
                        <Save className="h-3.5 w-3.5" />
                        {guardandoId === usuario.id ? "Guardando..." : "Guardar"}
                      </Button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {resultado && resultado.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="icon"
            aria-label="Página anterior"
            disabled={resultado.first}
            onClick={() => setPagina((p) => Math.max(p - 1, 0))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-neutral-600">
            Página {resultado.number + 1} de {resultado.totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            aria-label="Página siguiente"
            disabled={resultado.last}
            onClick={() => setPagina((p) => p + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}