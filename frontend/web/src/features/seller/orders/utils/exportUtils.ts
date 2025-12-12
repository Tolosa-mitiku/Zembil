import { Order } from '../api/ordersApi';
import { formatCurrency, formatDate } from '@/core/utils/format';

/**
 * Export orders to CSV format
 */
export const exportToCSV = (orders: Order[], filename: string = 'orders') => {
  if (orders.length === 0) {
    alert('No orders to export');
    return;
  }

  // Define CSV headers
  const headers = [
    'Order Number',
    'Customer Name',
    'Customer Email',
    'Status',
    'Items Count',
    'Total Amount',
    'Payment Status',
    'Shipping Address',
    'City',
    'Postal Code',
    'Country',
    'Tracking Number',
    'Carrier',
    'Order Date',
  ];

  // Convert orders to CSV rows
  const rows = orders.map(order => [
    order.orderNumber,
    order.customer.name,
    order.customer.email,
    order.status,
    order.items.length,
    order.totalPrice,
    'Paid', // Assuming all orders are paid
    order.shippingAddress.addressLine1,
    order.shippingAddress.city,
    order.shippingAddress.postalCode,
    order.shippingAddress.country,
    order.trackingNumber || '-',
    order.carrier || '-',
    formatDate(order.createdAt),
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export orders to Excel-compatible format (CSV with better formatting)
 */
export const exportToExcel = (orders: Order[], filename: string = 'orders') => {
  // For now, use enhanced CSV format that Excel can open
  // In a real app, you'd use a library like xlsx or exceljs
  exportToCSV(orders, filename);
};

/**
 * Generate printable invoice HTML for an order
 */
export const generateInvoiceHTML = (order: Order): string => {
  const itemsHTML = order.items
    .map(
      item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.title}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatCurrency(item.price)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: bold;">${formatCurrency(item.price * item.quantity)}</td>
    </tr>
  `
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice - ${order.orderNumber}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 3px solid #D4AF37;
    }
    .logo {
      font-size: 32px;
      font-weight: bold;
      color: #D4AF37;
    }
    .invoice-info {
      text-align: right;
    }
    .invoice-title {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 8px;
    }
    .invoice-number {
      color: #6b7280;
      font-size: 14px;
    }
    .section {
      margin-bottom: 30px;
    }
    .section-title {
      font-size: 14px;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      margin-bottom: 12px;
      letter-spacing: 0.5px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 30px;
      margin-bottom: 30px;
    }
    .info-box {
      background: #f9fafb;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    th {
      background: #f9fafb;
      padding: 12px;
      text-align: left;
      font-weight: 600;
      border-bottom: 2px solid #e5e7eb;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #6b7280;
    }
    th:nth-child(2), th:nth-child(3), th:nth-child(4) {
      text-align: right;
    }
    td {
      padding: 12px;
      border-bottom: 1px solid #e5e7eb;
    }
    .totals {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 16px;
    }
    .total-row.grand-total {
      font-size: 24px;
      font-weight: bold;
      color: #D4AF37;
      padding-top: 12px;
      border-top: 2px solid #D4AF37;
      margin-top: 12px;
    }
    .footer {
      margin-top: 60px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 14px;
    }
    .status-badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .status-delivered {
      background: #d1fae5;
      color: #065f46;
    }
    .status-shipped {
      background: #dbeafe;
      color: #1e40af;
    }
    .status-processing {
      background: #e9d5ff;
      color: #6b21a8;
    }
    .status-pending {
      background: #fed7aa;
      color: #9a3412;
    }
    @media print {
      body {
        padding: 0;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">ZEMBIL</div>
    <div class="invoice-info">
      <div class="invoice-title">INVOICE</div>
      <div class="invoice-number">#${order.orderNumber}</div>
      <div class="invoice-number">${formatDate(order.createdAt)}</div>
    </div>
  </div>

  <div class="info-grid">
    <div class="info-box">
      <div class="section-title">Bill To</div>
      <strong>${order.customer.name}</strong><br>
      ${order.customer.email}<br>
      ${order.shippingAddress.phoneNumber || ''}
    </div>
    <div class="info-box">
      <div class="section-title">Ship To</div>
      ${order.shippingAddress.addressLine1}<br>
      ${order.shippingAddress.addressLine2 ? order.shippingAddress.addressLine2 + '<br>' : ''}
      ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}<br>
      ${order.shippingAddress.country}
    </div>
  </div>

  <div class="section">
    <div class="section-title">Order Status</div>
    <span class="status-badge status-${order.status}">${order.status}</span>
    ${
      order.trackingNumber
        ? `
      <div style="margin-top: 12px; font-size: 14px; color: #6b7280;">
        <strong>Tracking:</strong> ${order.trackingNumber}
        ${order.carrier ? `<br><strong>Carrier:</strong> ${order.carrier}` : ''}
      </div>
    `
        : ''
    }
  </div>

  <div class="section">
    <div class="section-title">Order Items</div>
    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th style="text-align: center;">Quantity</th>
          <th style="text-align: right;">Unit Price</th>
          <th style="text-align: right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHTML}
      </tbody>
    </table>
  </div>

  <div class="totals">
    <div class="total-row">
      <span>Subtotal</span>
      <span>${formatCurrency(order.totalPrice)}</span>
    </div>
    <div class="total-row grand-total">
      <span>TOTAL</span>
      <span>${formatCurrency(order.totalPrice)}</span>
    </div>
  </div>

  <div class="footer">
    <p>Thank you for your business!</p>
    <p>For questions about this invoice, please contact support@zembil.com</p>
  </div>
</body>
</html>
  `;
};

/**
 * Print a single invoice
 */
export const printInvoice = (order: Order) => {
  const invoiceHTML = generateInvoiceHTML(order);
  const printWindow = window.open('', '_blank');
  
  if (printWindow) {
    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
    printWindow.focus();
    
    // Wait for content to load before printing
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }
};

/**
 * Print multiple invoices
 */
export const printMultipleInvoices = (orders: Order[]) => {
  if (orders.length === 0) {
    alert('No orders to print');
    return;
  }

  const invoicesHTML = orders.map(order => generateInvoiceHTML(order)).join('<div style="page-break-after: always;"></div>');
  const printWindow = window.open('', '_blank');
  
  if (printWindow) {
    printWindow.document.write(invoicesHTML);
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }
};

/**
 * Download invoice as PDF (requires browser print to PDF)
 */
export const downloadInvoicePDF = (order: Order) => {
  printInvoice(order);
  // Note: User will need to use "Save as PDF" in print dialog
  // For true PDF generation, you'd need a library like jsPDF or pdfmake
};

/**
 * Generate shipping label HTML
 */
export const generateShippingLabelHTML = (order: Order): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Shipping Label - ${order.orderNumber}</title>
  <style>
    body {
      font-family: 'Courier New', monospace;
      margin: 0;
      padding: 20px;
    }
    .label {
      width: 4in;
      height: 6in;
      border: 2px solid #000;
      padding: 20px;
      box-sizing: border-box;
    }
    .barcode {
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      letter-spacing: 4px;
      margin: 20px 0;
      padding: 10px;
      border: 2px dashed #000;
    }
    .section {
      margin: 15px 0;
      padding: 10px;
      border: 1px solid #000;
    }
    .section-title {
      font-weight: bold;
      font-size: 10px;
      margin-bottom: 5px;
    }
    .large-text {
      font-size: 14px;
      font-weight: bold;
    }
    @media print {
      body { padding: 0; }
    }
  </style>
</head>
<body>
  <div class="label">
    <div style="text-align: center; font-size: 18px; font-weight: bold; margin-bottom: 10px;">
      ZEMBIL
    </div>
    
    <div class="barcode">
      ${order.orderNumber}
    </div>
    
    ${
      order.trackingNumber
        ? `
      <div style="text-align: center; font-size: 12px; margin-bottom: 15px;">
        <strong>Tracking:</strong> ${order.trackingNumber}
      </div>
    `
        : ''
    }
    
    <div class="section">
      <div class="section-title">SHIP TO:</div>
      <div class="large-text">${order.customer.name}</div>
      <div>${order.shippingAddress.addressLine1}</div>
      ${order.shippingAddress.addressLine2 ? `<div>${order.shippingAddress.addressLine2}</div>` : ''}
      <div>${order.shippingAddress.city}, ${order.shippingAddress.postalCode}</div>
      <div class="large-text">${order.shippingAddress.country}</div>
      ${order.shippingAddress.phoneNumber ? `<div>Tel: ${order.shippingAddress.phoneNumber}</div>` : ''}
    </div>
    
    <div style="margin-top: 10px; text-align: center; font-size: 10px;">
      Order Date: ${formatDate(order.createdAt)}
    </div>
  </div>
</body>
</html>
  `;
};

/**
 * Print shipping label
 */
export const printShippingLabel = (order: Order) => {
  const labelHTML = generateShippingLabelHTML(order);
  const printWindow = window.open('', '_blank');
  
  if (printWindow) {
    printWindow.document.write(labelHTML);
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }
};

/**
 * Print multiple shipping labels
 */
export const printMultipleShippingLabels = (orders: Order[]) => {
  if (orders.length === 0) {
    alert('No orders to print labels for');
    return;
  }

  const labelsHTML = orders
    .map(order => generateShippingLabelHTML(order))
    .join('<div style="page-break-after: always;"></div>');
  const printWindow = window.open('', '_blank');
  
  if (printWindow) {
    printWindow.document.write(labelsHTML);
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }
};















