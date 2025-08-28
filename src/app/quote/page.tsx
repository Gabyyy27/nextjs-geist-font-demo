'use client'

import { useState } from 'react'
import { useInventory } from '@/context/InventoryContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { Calculator, FileText, Plus, Minus } from 'lucide-react'

interface QuoteItem {
  materialId: string
  quantity: number
}

interface QuoteData {
  clientName: string
  projectDescription: string
  laborCost: number
  items: QuoteItem[]
}

export default function QuotePage() {
  const { materials } = useInventory()
  const [quoteData, setQuoteData] = useState<QuoteData>({
    clientName: '',
    projectDescription: '',
    laborCost: 0,
    items: []
  })
  const [showSummary, setShowSummary] = useState(false)

  const addMaterialToQuote = (materialId: string) => {
    const existingItem = quoteData.items.find(item => item.materialId === materialId)
    
    if (existingItem) {
      setQuoteData(prev => ({
        ...prev,
        items: prev.items.map(item =>
          item.materialId === materialId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }))
    } else {
      setQuoteData(prev => ({
        ...prev,
        items: [...prev.items, { materialId, quantity: 1 }]
      }))
    }
  }

  const updateItemQuantity = (materialId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItemFromQuote(materialId)
      return
    }

    setQuoteData(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.materialId === materialId
          ? { ...item, quantity }
          : item
      )
    }))
  }

  const removeItemFromQuote = (materialId: string) => {
    setQuoteData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.materialId !== materialId)
    }))
  }

  const calculateMaterialsCost = () => {
    return quoteData.items.reduce((total, item) => {
      const material = materials.find(m => m.id === item.materialId)
      return total + (material ? material.unitCost * item.quantity : 0)
    }, 0)
  }

  const calculateTotalCost = () => {
    return calculateMaterialsCost() + quoteData.laborCost
  }

  const generateQuote = () => {
    if (!quoteData.clientName.trim()) {
      toast.error('Por favor ingresa el nombre del cliente')
      return
    }

    if (quoteData.items.length === 0) {
      toast.error('Agrega al menos un material a la cotización')
      return
    }

    setShowSummary(true)
    toast.success('Cotización generada correctamente')
  }

  const resetQuote = () => {
    setQuoteData({
      clientName: '',
      projectDescription: '',
      laborCost: 0,
      items: []
    })
    setShowSummary(false)
  }

  const materialsCost = calculateMaterialsCost()
  const totalCost = calculateTotalCost()

  if (materials.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Crear Cotización
          </h1>
          <p className="text-gray-600">
            Calcula el costo de tus trabajos de tapicería
          </p>
        </div>

        <Card>
          <CardContent className="text-center py-8">
            <div className="text-gray-500 mb-4">
              <div className="text-4xl mb-2">📦</div>
              <p>No tienes materiales en tu inventario</p>
              <p className="text-sm">Necesitas agregar materiales antes de crear cotizaciones</p>
            </div>
            <Button onClick={() => window.location.href = '/inventory'}>
              Ir a Inventario
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Crear Cotización
        </h1>
        <p className="text-gray-600">
          Calcula el costo de tus trabajos de tapicería
        </p>
      </div>

      {!showSummary ? (
        <>
          {/* Información del cliente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Información del Proyecto
              </CardTitle>
              <CardDescription>
                Datos básicos del cliente y proyecto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="clientName">Nombre del Cliente *</Label>
                <Input
                  id="clientName"
                  type="text"
                  placeholder="Nombre completo del cliente"
                  value={quoteData.clientName}
                  onChange={(e) => setQuoteData(prev => ({ ...prev, clientName: e.target.value }))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="projectDescription">Descripción del Proyecto</Label>
                <Textarea
                  id="projectDescription"
                  placeholder="Describe brevemente el trabajo a realizar..."
                  value={quoteData.projectDescription}
                  onChange={(e) => setQuoteData(prev => ({ ...prev, projectDescription: e.target.value }))}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="laborCost">Costo de Mano de Obra (L)</Label>
                <Input
                  id="laborCost"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={quoteData.laborCost || ''}
                  onChange={(e) => setQuoteData(prev => ({ ...prev, laborCost: parseFloat(e.target.value) || 0 }))}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Selección de materiales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Materiales del Proyecto
              </CardTitle>
              <CardDescription>
                Selecciona los materiales y cantidades necesarias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {materials.map((material) => {
                  const quoteItem = quoteData.items.find(item => item.materialId === material.id)
                  const isSelected = !!quoteItem

                  return (
                    <div
                      key={material.id}
                      className={`p-4 border rounded-lg ${
                        isSelected ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium text-gray-900">{material.name}</h3>
                          <p className="text-sm text-gray-600">
                            L {material.unitCost.toLocaleString('es-ES', { minimumFractionDigits: 2 })} / {material.unit}
                            <span className="ml-2 text-gray-500">
                              (Stock: {material.quantity} {material.unit})
                            </span>
                          </p>
                        </div>
                        {!isSelected && (
                          <Button
                            size="sm"
                            onClick={() => addMaterialToQuote(material.id)}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Agregar
                          </Button>
                        )}
                      </div>

                      {isSelected && (
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateItemQuantity(material.id, quoteItem.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              value={quoteItem.quantity}
                              onChange={(e) => updateItemQuantity(material.id, parseFloat(e.target.value) || 0)}
                              className="w-20 text-center"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateItemQuantity(material.id, quoteItem.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                            <span className="text-sm text-gray-600">{material.unit}</span>
                          </div>
                          <div className="flex-1 text-right">
                            <span className="font-medium text-green-600">
                              L {(material.unitCost * quoteItem.quantity).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeItemFromQuote(material.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Quitar
                          </Button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Resumen de costos */}
          {quoteData.items.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Resumen de Costos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Materiales:</span>
                    <span>L {materialsCost.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mano de obra:</span>
                    <span>L {quoteData.laborCost.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-green-600">
                      L {totalCost.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
                <Button onClick={generateQuote} className="w-full mt-4">
                  Generar Cotización
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        /* Resumen final de la cotización */
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Cotización Generada</CardTitle>
            <CardDescription className="text-center">
              Resumen completo del proyecto
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Información del Cliente</h3>
              <p><strong>Cliente:</strong> {quoteData.clientName}</p>
              {quoteData.projectDescription && (
                <p><strong>Proyecto:</strong> {quoteData.projectDescription}</p>
              )}
              <p><strong>Fecha:</strong> {new Date().toLocaleDateString('es-ES')}</p>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-3">Detalle de Materiales</h3>
              <div className="space-y-2">
                {quoteData.items.map((item) => {
                  const material = materials.find(m => m.id === item.materialId)
                  if (!material) return null

                  return (
                    <div key={item.materialId} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <div>
                        <span className="font-medium">{material.name}</span>
                        <span className="text-sm text-gray-600 ml-2">
                          {item.quantity} {material.unit} × L {material.unitCost.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <span className="font-medium">
                        L {(material.unitCost * item.quantity).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal Materiales:</span>
                <span>L {materialsCost.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span>Mano de Obra:</span>
                <span>L {quoteData.laborCost.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-xl">
                <span>Total:</span>
                <span className="text-green-600">
                  L {totalCost.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={resetQuote} variant="outline" className="flex-1">
                Nueva Cotización
              </Button>
              <Button 
                onClick={() => window.print()} 
                className="flex-1"
              >
                Imprimir
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
