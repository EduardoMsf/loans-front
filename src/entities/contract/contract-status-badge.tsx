import { Badge } from '@shared/ui/badge/badge'
import type { ContractStatus } from './contract.types'

const statusConfig: Record<
  ContractStatus,
  { label: string; variant: 'success' | 'warning' | 'error' | 'info' | 'neutral' }
> = {
  DRAFT: { label: 'Borrador', variant: 'neutral' },
  IN_PROGRESS: { label: 'En proceso', variant: 'info' },
  PENDING_SIGN: { label: 'Pendiente de firma', variant: 'warning' },
  ACTIVE: { label: 'Activo', variant: 'success' },
  COMPLETED: { label: 'Completado', variant: 'success' },
  REJECTED: { label: 'Rechazado', variant: 'error' },
}

export function ContractStatusBadge({ status }: { status: ContractStatus }) {
  const config = statusConfig[status]
  return <Badge variant={config.variant}>{config.label}</Badge>
}
