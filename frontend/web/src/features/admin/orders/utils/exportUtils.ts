import { AdminOrder } from '../api/ordersApi';
import { formatCurrency, formatDate } from '@/core/utils/format';

/**
 * Export orders to CSV format
 */
export const exportToCSV = (orders: AdminOrder[], filename: string = 'admin-orders') => {
  if (orders.length === 0) {
    alert('No orders to export');
    return;
  }

  // Define CSV headers
  const headers = [
    'Order Number',
    'Customer Name',
    'Customer Email',
    'Seller Name',
    'Seller Email',
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
    order.seller.name,
    order.seller.email || '-',
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
export const exportToExcel = (orders: AdminOrder[], filename: string = 'admin-orders') => {
  // For now, use enhanced CSV format that Excel can open
  // In a real app, you'd use a library like xlsx or exceljs
  exportToCSV(orders, filename);
};

/**
 * Generate printable invoice HTML for an order
 */
export const generateInvoiceHTML = (order: AdminOrder): string => {
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
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
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
    .admin-badge {
      display: inline-block;
      background: #fbbf24;
      color: #92400e;
      padding: 4px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
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
      <div class="admin-badge">ADMIN COPY</div>
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
    <div class="info-box">
      <div class="section-title">Seller</div>
      <strong>${order.seller.name}</strong><br>
      ${order.seller.email || ''}
    </div>
  </div>

  <div class="section">
    <div class="section-title">Order Status: ${order.status}</div>
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
export const printInvoice = (order: AdminOrder) => {
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
export const printMultipleInvoices = (orders: AdminOrder[]) => {
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

