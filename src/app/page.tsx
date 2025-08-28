'use client'

import { useMaterials } from '@/context/MaterialsContext'
import { useQuotes } from '@/context/QuotesContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { formatCurrency, formatDate } from '@/lib/pdfExport'

export default function HomePage() {
  const { materials } = useMaterials()
  const { quotes, getRecentQuotes } = useQuotes()

  const totalMaterials = materials.length
  const totalQuotes = quotes.length
  const recentQuotes = getRecentQuotes(3)
  const totalQuotesValue = quotes.reduce((sum, quote) => sum + quote.totalCost, 0)

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Bienvenido a Tapicería Gaby
        </h1>
        <p className="text-gray-600">
          Gestiona tus materiales y crea cotizaciones profesionales
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Estadísticas generales */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{totalMaterials}</div>
                <div className="text-sm text-gray-500">Materiales</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{totalQuotes}</div>
                <div className="text-sm text-gray-500">Cotizaciones</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Valor total de cotizaciones */}
        {totalQuotes > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Resumen de Negocio</CardTitle>
              <CardDescription>
                Valor total de todas las cotizaciones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {formatCurrency(totalQuotesValue)}
                </div>
                <div className="text-sm text-gray-500 mt-1">Valor Total Cotizado</div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Acciones rápidas */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
            <CardDescription>
              Accede a las funciones principales
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/materials" className="block">
              <Button className="w-full" variant="default">
                Gestionar Materiales
              </Button>
            </Link>
            <Link href="/quote" className="block">
              <Button className="w-full" variant="outline">
                Crear Cotización
              </Button>
            </Link>
            {totalQuotes > 0 && (
              <Link href="/history" className="block">
                <Button className="w-full" variant="outline">
                  Ver Historial
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>

        {/* Materiales recientes */}
        {materials.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Materiales Recientes</CardTitle>
              <CardDescription>
                Últimos materiales agregados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {materials.slice(-3).reverse().map((material) => (
                  <div key={material.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <div>
                      <div className="font-medium text-sm">{material.name}</div>
                      <div className="text-xs text-gray-500">
                        {material.unit}
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(material.unitCost)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cotizaciones recientes */}
        {recentQuotes.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Cotizaciones Recientes</CardTitle>
              <CardDescription>
                Últimas cotizaciones creadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentQuotes.map((quote) => (
                  <div key={quote.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <div>
                      <div className="font-medium text-sm">{quote.clientName}</div>
                      <div className="text-xs text-gray-500">
                        {formatDate(quote.createdDate)}
                      </div>
                    </div>
                    <div className="text-sm font-medium text-green-600">
                      {formatCurrency(quote.totalCost)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Estado vacío */}
        {materials.length === 0 && totalQuotes === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <div className="text-gray-500 mb-4">
                <div className="text-4xl mb-2">🚀</div>
                <p>¡Comienza tu negocio de tapicería!</p>
                <p className="text-sm">Agrega materiales y crea tu primera cotización</p>
              </div>
              <div className="space-y-2">
                <Link href="/materials">
                  <Button className="w-full">Agregar Materiales</Button>
                </Link>
                <Link href="/quote">
                  <Button variant="outline" className="w-full">Crear Cotización</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Solo materiales, sin cotizaciones */}
        {materials.length > 0 && totalQuotes === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <div className="text-gray-500 mb-4">
                <div className="text-4xl mb-2">📋</div>
                <p>Ya tienes materiales registrados</p>
                <p className="text-sm">¡Ahora crea tu primera cotización!</p>
              </div>
              <Link href="/quote">
                <Button>Crear Primera Cotización</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
