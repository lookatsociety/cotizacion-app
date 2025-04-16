import { QuotationFormData, QuotationWithItems } from "@shared/schema";
import { jsPDF } from "jspdf";
import 'jspdf-autotable';

// Initialize with typings for autotable
declare global {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

// Format currency to MXN
function formatCurrency(amount: number) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(amount);
}

// Format date to Spanish format
function formatDate(dateString: string | Date) {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return date.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// Default company information
const defaultCompanyInfo = {
  name: "Mi Empresa SRL",
  email: "contacto@miempresa.com",
  phone: "+52 (123) 456-7890",
  address: "Av. Principal 123, Ciudad de México, CDMX, 06000",
};

export function generatePdf(quotation: QuotationFormData | QuotationWithItems) {
  // Create a new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Prepare quotation data
  const items = 'items' in quotation ? quotation.items : [];
  const date = typeof quotation.date === 'string' 
    ? formatDate(quotation.date) 
    : formatDate(quotation.date as Date);
  const validUntil = quotation.validUntil 
    ? formatDate(quotation.validUntil) 
    : formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));

  // Set font
  doc.setFont('helvetica', 'normal');
  
  // Add border to the page (black border with rounded corners)
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.roundedRect(10, 10, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 20, 3, 3);
  
  // Add header
  doc.setFontSize(22);
  doc.setTextColor(0, 0, 0); // Black header for better printing
  doc.text('COTIZACIÓN', 20, 25);
  
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text(`#${quotation.quotationNumber}`, 20, 32);
  
  // Add company information
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text('De:', 20, 45);
  doc.setFont('helvetica', 'bold');
  doc.text("SPEK", 20, 50);
  doc.setFont('helvetica', 'normal');
  doc.text("Ing. Victor Galván Santoyo", 20, 55);
  doc.text("Servicios y Productos Especializados Krapsol (S.P.E.K) S.A. de C.V.", 20, 60);
  doc.text("81 1991 1723", 20, 65);
  doc.text("vgalvan@spekmx.com     www.spekmx.com", 20, 70);
  
  // Add customer information
  doc.text('Para:', 120, 45);
  doc.setFont('helvetica', 'bold');
  doc.text(quotation.customerName || 'Cliente', 120, 50);
  
  if (quotation.customerEmail) {
    doc.setFont('helvetica', 'normal');
    doc.text(quotation.customerEmail, 120, 55);
  }
  
  if (quotation.customerPhone) {
    doc.setFont('helvetica', 'normal');
    doc.text(quotation.customerPhone, 120, 60);
  }
  
  if (quotation.customerAddress) {
    doc.setFont('helvetica', 'normal');
    const addressLines = doc.splitTextToSize(quotation.customerAddress, 70);
    doc.text(addressLines, 120, quotation.customerPhone ? 65 : 60);
  }
  
  // Add project name if available
  if (quotation.projectName) {
    doc.setFont('helvetica', 'bold');
    doc.text('Proyecto:', 20, 80);
    doc.setFont('helvetica', 'normal');
    doc.text(quotation.projectName, 55, 80);
  }
  
  // Add quotation details
  doc.text('Fecha de Emisión:', 20, 85);
  doc.text(date, 65, 85);
  
  doc.text('Válido Hasta:', 120, 85);
  doc.text(validUntil, 165, 85);
  
  // Add table header
  const tableHeaders = [['Descripción', 'Cant.', 'Precio', 'Total']];
  
  // Add table rows
  const tableRows = items.map((item, index) => [
    {
      content: item.name + (item.description ? `\n${item.description}` : ''),
      styles: { cellWidth: 'auto' }
    },
    { 
      content: `#${index + 1} ${Number(item.quantity).toString()}`,
      styles: { halign: 'center' }
    },
    { 
      content: formatCurrency(Number(item.price)),
      styles: { halign: 'right' }
    },
    { 
      content: formatCurrency(Number(item.total)),
      styles: { halign: 'right' }
    }
  ]);
  
  // Add table to document
  doc.autoTable({
    head: tableHeaders,
    body: tableRows,
    startY: 95, // Ajustar posición más abajo
    theme: 'grid',
    headStyles: {
      fillColor: [240, 240, 240],
      textColor: [0, 0, 0],  // Negro para mejor contraste
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 10,
      cellPadding: 5,
      lineColor: [0, 0, 0], // Líneas negras para mejor impresión
      lineWidth: 0.1,
    },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 15, halign: 'center' },
      2: { cellWidth: 25, halign: 'right' },
      3: { cellWidth: 25, halign: 'right' },
    },
  });

  // Get the final Y position after the table is drawn
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  // Add summary
  doc.setFontSize(10);
  doc.text('Subtotal:', 140, finalY);
  doc.text(formatCurrency(Number(quotation.subtotal)), 170, finalY, { align: 'right' });
  
  doc.text(`IVA (${Number(quotation.taxRate)}%):`, 140, finalY + 6);
  doc.text(formatCurrency(Number(quotation.taxAmount)), 170, finalY + 6, { align: 'right' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Total:', 140, finalY + 15);
  doc.text(formatCurrency(Number(quotation.total)), 170, finalY + 15, { align: 'right' });
  
  // Calcular la posición para las secciones de notas y condiciones
  let currentY = finalY + 30;
  
  // Add notes if available
  if (quotation.notes) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Notas:', 20, currentY);
    doc.setFont('helvetica', 'normal');
    const noteLines = doc.splitTextToSize(quotation.notes, 170);
    doc.text(noteLines, 20, currentY + 6);
    currentY += 6 + noteLines.length * 5; // Ajustar la posición basada en el número de líneas
  }
  
  // Add delivery terms if available
  if (quotation.deliveryTerms) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Condiciones de entrega y pago:', 20, currentY + 6);
    doc.setFont('helvetica', 'normal');
    const termLines = doc.splitTextToSize(quotation.deliveryTerms, 170);
    doc.text(termLines, 20, currentY + 12);
  }
  
  // Add footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    `¿Preguntas? Contáctenos: ${defaultCompanyInfo.email} | ${defaultCompanyInfo.phone}`,
    doc.internal.pageSize.width / 2,
    pageHeight - 15,
    { align: 'center' }
  );
  doc.text(
    'Gracias por su preferencia.',
    doc.internal.pageSize.width / 2,
    pageHeight - 10,
    { align: 'center' }
  );
  
  // Save the PDF
  doc.save(`cotizacion_${quotation.quotationNumber}.pdf`);
}
