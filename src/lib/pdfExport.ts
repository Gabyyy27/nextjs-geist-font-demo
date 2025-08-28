import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { Quote } from '@/context/QuotesContext'

// Función para formatear moneda en lempiras
export const formatCurrency = (amount: number): string => {
  return `L ${amount.toLocaleString('es-HN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

// Función para formatear fecha
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('es-HN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Función principal para generar PDF de cotización (solo datos del cliente)
export const generateQuotePDF = async (quote: Quote): Promise<void> => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 20
    let yPosition = margin

    // Configurar fuentes
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(20)
    
    // Título
    pdf.text('COTIZACIÓN', pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 15

    // Línea separadora
    pdf.setLineWidth(0.5)
    pdf.line(margin, yPosition, pageWidth - margin, yPosition)
    yPosition += 20

    // Información del cliente
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(14)
    pdf.text('INFORMACIÓN DEL CLIENTE', margin, yPosition)
    yPosition += 12

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(12)
    pdf.text(`Cliente: ${quote.clientName}`, margin, yPosition)
    yPosition += 10
    
    if (quote.projectDescription) {
      pdf.text(`Proyecto: ${quote.projectDescription}`, margin, yPosition)
      yPosition += 10
    }
    
    pdf.text(`Fecha: ${formatDate(quote.createdDate)}`, margin, yPosition)
    yPosition += 8
    pdf.text(`Cotización #: ${quote.id.slice(-8).toUpperCase()}`, margin, yPosition)
    yPosition += 20

    // Detalle de materiales
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(14)
    pdf.text('DETALLE DE MATERIALES', margin, yPosition)
    yPosition += 12

    // Encabezados de tabla
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(10)
    const colWidths = [80, 25, 25, 25, 35]
    const colPositions = [margin, margin + colWidths[0], margin + colWidths[0] + colWidths[1], 
                         margin + colWidths[0] + colWidths[1] + colWidths[2], 
                         margin + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3]]

    pdf.text('Material', colPositions[0], yPosition)
    pdf.text('Cantidad', colPositions[1], yPosition)
    pdf.text('Unidad', colPositions[2], yPosition)
    pdf.text('Precio Unit.', colPositions[3], yPosition)
    pdf.text('Total', colPositions[4], yPosition)
    yPosition += 5

    // Línea bajo encabezados
    pdf.setLineWidth(0.3)
    pdf.line(margin, yPosition, pageWidth - margin, yPosition)
    yPosition += 10

    // Contenido de la tabla
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(10)

    quote.items.forEach((item) => {
      // Verificar si necesitamos una nueva página
      if (yPosition > pageHeight - 50) {
        pdf.addPage()
        yPosition = margin
      }

      pdf.text(item.materialName, colPositions[0], yPosition)
      pdf.text(item.quantity.toString(), colPositions[1], yPosition)
      pdf.text(item.unit, colPositions[2], yPosition)
      pdf.text(formatCurrency(item.unitCost), colPositions[3], yPosition)
      pdf.text(formatCurrency(item.totalCost), colPositions[4], yPosition)
      yPosition += 8
    })

    yPosition += 8
    pdf.setLineWidth(0.3)
    pdf.line(margin, yPosition, pageWidth - margin, yPosition)
    yPosition += 12

    // Resumen de costos
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(11)
    
    const summaryX = pageWidth - margin - 80
    pdf.text('Subtotal Materiales:', summaryX, yPosition)
    pdf.text(formatCurrency(quote.materialsCost), summaryX + 50, yPosition)
    yPosition += 8

    pdf.text('Mano de Obra:', summaryX, yPosition)
    pdf.text(formatCurrency(quote.laborCost), summaryX + 50, yPosition)
    yPosition += 12

    // Total
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(14)
    pdf.text('TOTAL:', summaryX, yPosition)
    pdf.text(formatCurrency(quote.totalCost), summaryX + 50, yPosition)

    // Pie de página
    yPosition = pageHeight - 25
    pdf.setFont('helvetica', 'italic')
    pdf.setFontSize(9)
    pdf.text('Esta cotización tiene validez de 30 días.', margin, yPosition)

    // Generar nombre del archivo
    const fileName = `Cotizacion_${quote.clientName.replace(/\s+/g, '_')}_${quote.id.slice(-8)}.pdf`
    
    // Descargar el PDF
    pdf.save(fileName)
    
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw new Error('Error al generar el PDF. Por favor, inténtalo de nuevo.')
  }
}

// Función alternativa usando html2canvas para capturar elementos HTML
export const generatePDFFromElement = async (elementId: string, fileName: string): Promise<void> => {
  try {
    const element = document.getElementById(elementId)
    if (!element) {
      throw new Error('Elemento no encontrado')
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = canvas.width
    const imgHeight = canvas.height
    
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
    const imgX = (pdfWidth - imgWidth * ratio) / 2
    const imgY = 0

    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
    pdf.save(fileName)
    
  } catch (error) {
    console.error('Error generating PDF from element:', error)
    throw new Error('Error al generar el PDF. Por favor, inténtalo de nuevo.')
  }
}
