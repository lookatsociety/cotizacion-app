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
  
  // Add header
  doc.setFontSize(24);
  doc.setTextColor(66, 63, 232); // Header color to match primary
  doc.text('COTIZACIÓN', 20, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`#${quotation.quotationNumber}`, 20, 26);
  
  // Add company information
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text('De:', 20, 40);
  doc.setFont('helvetica', 'bold');
  doc.text(defaultCompanyInfo.name, 20, 45);
  doc.setFont('helvetica', 'normal');
  doc.text(defaultCompanyInfo.email, 20, 50);
  doc.text(defaultCompanyInfo.phone, 20, 55);
  doc.text(defaultCompanyInfo.address, 20, 60);
  
  // Add customer information
  doc.text('Para:', 120, 40);
  doc.setFont('helvetica', 'bold');
  doc.text(quotation.customerName, 120, 45);
  
  if (quotation.customerEmail) {
    doc.setFont('helvetica', 'normal');
    doc.text(quotation.customerEmail, 120, 50);
  }
  
  if (quotation.customerPhone) {
    doc.setFont('helvetica', 'normal');
    doc.text(quotation.customerPhone, 120, 55);
  }
  
  if (quotation.customerAddress) {
    doc.setFont('helvetica', 'normal');
    const addressLines = doc.splitTextToSize(quotation.customerAddress, 70);
    doc.text(addressLines, 120, quotation.customerPhone ? 60 : 55);
  }
  
  // Add quotation details
  doc.text('Fecha de Emisión:', 20, 75);
  doc.text(date, 60, 75);
  
  doc.text('Válido Hasta:', 120, 75);
  doc.text(validUntil, 160, 75);
  
  // Add table header
  const tableHeaders = [['Descripción', 'Cant.', 'Precio', 'Total']];
  
  // Add table rows
  const tableRows = items.map(item => [
    {
      content: item.name + (item.description ? `\n${item.description}` : ''),
      styles: { cellWidth: 'auto' }
    },
    { 
      content: item.quantity.toString(),
      styles: { halign: 'center' }
    },
    { 
      content: formatCurrency(item.price),
      styles: { halign: 'right' }
    },
    { 
      content: formatCurrency(item.total),
      styles: { halign: 'right' }
    }
  ]);
  
  // Add table to document
  doc.autoTable({
    head: tableHeaders,
    body: tableRows,
    startY: 85,
    theme: 'grid',
    headStyles: {
      fillColor: [240, 240, 240],
      textColor: [80, 80, 80],
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 10,
      cellPadding: 5,
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
  doc.text(formatCurrency(quotation.subtotal), 170, finalY, { align: 'right' });
  
  doc.text(`IVA (${quotation.taxRate}%):`, 140, finalY + 6);
  doc.text(formatCurrency(quotation.taxAmount), 170, finalY + 6, { align: 'right' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Total:', 140, finalY + 15);
  doc.text(formatCurrency(quotation.total), 170, finalY + 15, { align: 'right' });
  
  // Add notes if available
  if (quotation.notes) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Notas:', 20, finalY + 30);
    doc.setFont('helvetica', 'normal');
    const noteLines = doc.splitTextToSize(quotation.notes, 170);
    doc.text(noteLines, 20, finalY + 36);
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
