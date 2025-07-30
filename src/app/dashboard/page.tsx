import {
  ArrowUpRight,
  Users,
  CreditCard,
  DollarSign,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  MoreHorizontal,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@radix-ui/react-dropdown-menu"
import { getSummary } from "../lib/actions/homeActions"
import { TransactionCharts } from "@/components/charts/TransactionCharts"


export default async function Dashboard() {

  const { data } = await getSummary();

  const metricas = {
    clientesActivos: 89,
    beneficiarios: 156,
    pagosEsteMes: {
      total: 247,
      cheques: 98,
      transferencias: 149,
    },
    montoTotalEsteMes: 2450000,
  }

  const ultimosClientes = [
    {
      id: "CLI-001",
      nombre: "Empresa ABC S.A.",
      email: "contacto@empresaabc.com",
      telefono: "+57 300 123 4567",
      fechaRegistro: "2024-01-15",
      estado: "Activo",
    },
    {
      id: "CLI-002",
      nombre: "Comercial XYZ Ltda.",
      email: "info@comercialxyz.com",
      telefono: "+57 301 987 6543",
      fechaRegistro: "2024-01-14",
      estado: "Activo",
    },
    {
      id: "CLI-003",
      nombre: "Distribuidora 123",
      email: "ventas@dist123.com",
      telefono: "+57 302 456 7890",
      fechaRegistro: "2024-01-13",
      estado: "Pendiente",
    },
    {
      id: "CLI-004",
      nombre: "Servicios Pro S.A.S.",
      email: "admin@serviciospro.com",
      telefono: "+57 303 654 3210",
      fechaRegistro: "2024-01-12",
      estado: "Activo",
    },
    {
      id: "CLI-005",
      nombre: "Tecnología Avanzada",
      email: "contacto@tecavanzada.com",
      telefono: "+57 304 789 0123",
      fechaRegistro: "2024-01-11",
      estado: "Activo",
    },
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getEstadoClienteBadge = (estado: string) => {
    switch (estado) {
      case "Activo":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Activo</Badge>
      case "Pendiente":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pendiente</Badge>
      case "Inactivo":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inactivo</Badge>
      default:
        return <Badge variant="secondary">{estado}</Badge>
    }
  }
  return (
    <>
       <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Gestión de Clientes y Beneficiarios</p>
            </div>
            <div className="flex gap-3">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Pago
              </Button>
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Ver Reportes
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes Activos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metricas.clientesActivos}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600 flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +5 nuevos esta semana
                </span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Beneficiarios Registrados</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metricas.beneficiarios}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-blue-600 flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +3 nuevos esta semana
                </span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pagos Procesados (Este Mes)</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metricas.pagosEsteMes.total}</div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                  Transferencias: {metricas.pagosEsteMes.transferencias}
                </span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  Cheques: {metricas.pagosEsteMes.cheques}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monto Total (Este Mes)</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(metricas.montoTotalEsteMes)}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600 flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +15% vs mes anterior
                </span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico y resumen rápido */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Actividad de Transacciones</CardTitle>
              <CardDescription>Últimos 7 días</CardDescription>
            </CardHeader>
            <CardContent>
                <TransactionCharts data={data} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribución por Tipo</CardTitle>
              <CardDescription>Métodos de pago</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-sm">Transferencias</span>
                </div>
                <span className="text-sm font-medium">65%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm">Cheques</span>
                </div>
                <span className="text-sm font-medium">35%</span>
              </div>
              <div className="pt-4">
                <div className="text-center text-gray-500">
                  <div className="w-24 h-24 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center">
                    <CreditCard className="h-8 w-8 opacity-50" />
                  </div>
                  <p className="text-sm">Gráfico circular</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Últimos clientes registrados */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Últimos Clientes Registrados</CardTitle>
                <CardDescription>Clientes agregados recientemente al sistema</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                Ver todos
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Fecha Registro</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ultimosClientes.map((cliente) => (
                  <TableRow key={cliente.id}>
                    <TableCell className="font-medium">{cliente.id}</TableCell>
                    <TableCell className="font-medium">{cliente.nombre}</TableCell>
                    <TableCell className="text-sm text-gray-600">{cliente.email}</TableCell>
                    <TableCell className="text-sm text-gray-600">{cliente.telefono}</TableCell>
                    <TableCell className="text-sm text-gray-500">{cliente.fechaRegistro}</TableCell>
                    <TableCell>{getEstadoClienteBadge(cliente.estado)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Ver perfil</DropdownMenuItem>
                          <DropdownMenuItem>Editar información</DropdownMenuItem>
                          <DropdownMenuItem>Ver historial de pagos</DropdownMenuItem>
                          <DropdownMenuItem>Desactivar cliente</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Alertas y notificaciones */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="h-5 w-5 text-orange-500 mr-2" />
                Alertas Importantes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">12 transacciones pendientes de aprobación</p>
                  <p className="text-xs text-gray-600">Requieren revisión manual</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Sistema actualizado correctamente</p>
                  <p className="text-xs text-gray-600">Versión 2.1.0 instalada</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Registrar Nuevo Cliente
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Agregar Beneficiario
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <CreditCard className="h-4 w-4 mr-2" />
                Procesar Pago Manual
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <TrendingUp className="h-4 w-4 mr-2" />
                Generar Reporte
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </>
  );
}
