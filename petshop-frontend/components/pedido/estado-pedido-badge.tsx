import { Badge, type BadgeProps } from "@/components/ui/badge";
import type { EstadoPedido } from "@/lib/types";

const ESTILOS_ESTADO: Record<EstadoPedido, { label: string; variant: BadgeProps["variant"] }> = {
  PENDIENTE: { label: "Pendiente", variant: "muted" },
  CONFIRMADO: { label: "Confirmado", variant: "default" },
  ENVIADO: { label: "Enviado", variant: "default" },
  ENTREGADO: { label: "Entregado", variant: "default" },
  CANCELADO: { label: "Cancelado", variant: "outline" },
};

export function EstadoPedidoBadge({ estado }: { estado: EstadoPedido }) {
  const config = ESTILOS_ESTADO[estado] ?? { label: estado, variant: "muted" as const };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
