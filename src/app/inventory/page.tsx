'use client'

import { useState } from 'react'
import { useInventory, Material } from '@/context/InventoryContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Trash2, Edit2, Plus } from 'lucide-react'

export default function InventoryPage() {
  const { materials, addMaterial, updateMaterial, deleteMaterial } = useInventory()
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    unitCost: '',
    quantity: '',
    unit: 'metros'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.unitCost || !formData.quantity) {
      toast.error('Por favor completa todos los campos')
      return
    }

    const unitCost = parseFloat(formData.unitCost)
    const quantity = parseFloat(formData.quantity)

    if (unitCost <= 0 || quantity <= 0) {
      toast.error('El costo y la cantidad deben ser mayores a 0')
      return
    }

    if (isEditing) {
      updateMaterial(isEditing, {
        name: formData.name.trim(),
        unitCost,
        quantity,
        unit: formData.unit
      })
      toast.success('Material actualizado correctamente')
      setIsEditing(null)
    } else {
      addMaterial({
        name: formData.name.trim(),
        unitCost,
        quantity,
        unit: formData.unit
      })
      toast.success('Material agregado correctamente')
    }

    setFormData({ name: '', unitCost: '', quantity: '', unit: 'metros' })
  }

  const handleEdit = (material: Material) => {
    setFormData({
      name: material.name,
      unitCost: material.unitCost.toString(),
      quantity: material.quantity.toString(),
      unit: material.unit
    })
    setIsEditing(material.id)
  }

  const handleDelete = (id: string, name: string) => {
    if (confirm(`¿Estás seguro de eliminar "${name}"?`)) {
      deleteMaterial(id)
      toast.success('Material eliminado correctamente')
    }
  }

  const cancelEdit = () => {
    setIsEditing(null)
    setFormData({ name: '', unitCost: '', quantity: '', unit: 'metros' })
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Gestión de Inventario
        </h1>
        <p className="text-gray-600">
          Administra tus materiales de tapicería
        </p>
      </div>

      {/* Formulario para agregar/editar materiales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            {isEditing ? 'Editar Material' : 'Agregar Nuevo Material'}
          </CardTitle>
          <CardDescription>
            {isEditing ? 'Modifica los datos del material' : 'Completa la información del material'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre del Material</Label>
              <Input
                id="name"
                type="text"
                placeholder="ej: Tela de algodón, Espuma, etc."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="unitCost">Costo Unitario ($)</Label>
                <Input
                  id="unitCost"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.unitCost}
                  onChange={(e) => setFormData({ ...formData, unitCost: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="quantity">Cantidad</Label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="unit">Unidad de Medida</Label>
              <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="metros">Metros</SelectItem>
                  <SelectItem value="unidades">Unidades</SelectItem>
                  <SelectItem value="kg">Kilogramos</SelectItem>
                  <SelectItem value="litros">Litros</SelectItem>
                  <SelectItem value="m2">Metros cuadrados</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                {isEditing ? 'Actualizar Material' : 'Agregar Material'}
              </Button>
              {isEditing && (
                <Button type="button" variant="outline" onClick={cancelEdit}>
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Lista de materiales */}
      <Card>
        <CardHeader>
          <CardTitle>Materiales en Inventario ({materials.length})</CardTitle>
          <CardDescription>
            Lista de todos tus materiales disponibles
          </CardDescription>
        </CardHeader>
        <CardContent>
          {materials.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📦</div>
              <p>No hay materiales en el inventario</p>
              <p className="text-sm">Agrega tu primer material usando el formulario de arriba</p>
            </div>
          ) : (
            <div className="space-y-3">
              {materials.map((material) => (
                <div
                  key={material.id}
                  className={`p-4 border rounded-lg ${
                    isEditing === material.id ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{material.name}</h3>
                      <div className="mt-1 text-sm text-gray-600">
                        <span className="inline-block mr-4">
                          Costo: ${material.unitCost.toLocaleString('es-ES', { minimumFractionDigits: 2 })} / {material.unit}
                        </span>
                        <span className="inline-block mr-4">
                          Stock: {material.quantity} {material.unit}
                        </span>
                        <span className="inline-block font-medium text-green-600">
                          Total: ${(material.unitCost * material.quantity).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(material)}
                        disabled={isEditing !== null && isEditing !== material.id}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(material.id, material.name)}
                        disabled={isEditing !== null}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
