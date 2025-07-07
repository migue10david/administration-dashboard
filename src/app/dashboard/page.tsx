"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, FileText, TrendingUp, Users } from "lucide-react"


export default function Dashboard() {
        return (
          <>
            <div className="mx-auto max-w-7xl grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-muted-foreground">+20.1% desde el mes pasado</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Compañías Activas</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">89</div>
                  <p className="text-xs text-muted-foreground">+12.5% desde el mes pasado</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cheques Procesados</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2,456</div>
                  <p className="text-xs text-muted-foreground">+8.2% desde el mes pasado</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$45,231.89</div>
                  <p className="text-xs text-muted-foreground">+15.3% desde el mes pasado</p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Resumen de Actividad</CardTitle>
                  <CardDescription>Vista general de las actividades recientes en el sistema</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Nuevo cliente registrado</p>
                        <p className="text-xs text-muted-foreground">Hace 2 horas</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Cheque procesado exitosamente</p>
                        <p className="text-xs text-muted-foreground">Hace 4 horas</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Nueva compañía agregada</p>
                        <p className="text-xs text-muted-foreground">Hace 6 horas</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Actualización de datos completada</p>
                        <p className="text-xs text-muted-foreground">Hace 8 horas</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Acciones Rápidas</CardTitle>
                  <CardDescription>Accesos directos a las funciones más utilizadas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <button className="w-full p-3 text-left border rounded-lg hover:bg-muted transition-colors">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        <span className="text-sm font-medium">Agregar Cliente</span>
                      </div>
                    </button>
                    <button className="w-full p-3 text-left border rounded-lg hover:bg-muted transition-colors">
                      <div className="flex items-center">
                        <Building2 className="h-4 w-4 mr-2" />
                        <span className="text-sm font-medium">Nueva Compañía</span>
                      </div>
                    </button>
                    <button className="w-full p-3 text-left border rounded-lg hover:bg-muted transition-colors">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        <span className="text-sm font-medium">Procesar Cheque</span>
                      </div>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )
    }


