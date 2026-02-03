import jsPDF from "jspdf";

interface OrderItem {
  id: string;
  product_title: string;
  variant_title?: string;
  price: number;
  quantity: number;
}

interface Order {
  order_number: string;
  created_at: string;
  status: string;
  full_name: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  subtotal: number;
  shipping_cost: number;
  total: number;
  currency: string;
  estimated_delivery?: string;
  items?: OrderItem[];
}

export const generateOrderPdf = (order: Order) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // Helper function to add text
  const addText = (text: string, x: number, fontSize: number = 10, style: "normal" | "bold" = "normal") => {
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", style);
    doc.text(text, x, y);
  };

  // Header
  doc.setFillColor(139, 90, 43); // Primary brand color
  doc.rect(0, 0, pageWidth, 35, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("ORDER INVOICE", 20, 23);
  
  // Order number on header
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(order.order_number, pageWidth - 20, 23, { align: "right" });

  // Reset text color
  doc.setTextColor(0, 0, 0);
  y = 50;

  // Order Info Section
  doc.setFillColor(245, 245, 245);
  doc.rect(15, y - 5, pageWidth - 30, 25, "F");
  
  addText("Order Date:", 20, 10, "bold");
  y += 5;
  addText(new Date(order.created_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }), 20);
  
  y -= 5;
  addText("Status:", pageWidth / 2, 10, "bold");
  y += 5;
  addText(order.status.charAt(0).toUpperCase() + order.status.slice(1), pageWidth / 2);
  
  y += 20;

  // Two columns: Customer Info and Shipping Address
  const colWidth = (pageWidth - 40) / 2;
  
  // Customer Information
  doc.setFillColor(250, 250, 250);
  doc.rect(15, y - 5, colWidth, 45, "F");
  doc.setDrawColor(200, 200, 200);
  doc.rect(15, y - 5, colWidth, 45, "S");
  
  addText("CUSTOMER INFORMATION", 20, 11, "bold");
  y += 8;
  addText(order.full_name, 20);
  y += 6;
  addText(order.email, 20);
  if (order.phone) {
    y += 6;
    addText(order.phone, 20);
  }
  
  // Shipping Address
  const rightCol = 20 + colWidth + 10;
  let yRight = y - (order.phone ? 20 : 14);
  
  doc.setFillColor(250, 250, 250);
  doc.rect(15 + colWidth + 5, yRight - 8, colWidth, 45, "F");
  doc.setDrawColor(200, 200, 200);
  doc.rect(15 + colWidth + 5, yRight - 8, colWidth, 45, "S");
  
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("SHIPPING ADDRESS", rightCol, yRight);
  yRight += 8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(order.address, rightCol, yRight);
  yRight += 6;
  doc.text(`${order.city}, ${order.state}`, rightCol, yRight);
  yRight += 6;
  doc.text(order.pincode, rightCol, yRight);

  y += 35;

  // Order Items Table
  addText("ORDER ITEMS", 20, 12, "bold");
  y += 8;

  // Table header
  doc.setFillColor(139, 90, 43);
  doc.rect(15, y - 4, pageWidth - 30, 10, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("PRODUCT", 20, y + 2);
  doc.text("SIZE", 110, y + 2);
  doc.text("QTY", 135, y + 2);
  doc.text("PRICE", 155, y + 2);
  doc.text("TOTAL", 180, y + 2);
  
  y += 10;
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");

  // Table rows
  if (order.items && order.items.length > 0) {
    order.items.forEach((item, index) => {
      if (index % 2 === 0) {
        doc.setFillColor(250, 250, 250);
        doc.rect(15, y - 4, pageWidth - 30, 10, "F");
      }
      
      // Truncate long product titles
      const title = item.product_title.length > 40 
        ? item.product_title.substring(0, 37) + "..." 
        : item.product_title;
      
      doc.text(title, 20, y + 2);
      doc.text(item.variant_title || "-", 110, y + 2);
      doc.text(item.quantity.toString(), 135, y + 2);
      doc.text(`₹${item.price.toLocaleString("en-IN")}`, 155, y + 2);
      doc.text(`₹${(item.price * item.quantity).toLocaleString("en-IN")}`, 180, y + 2);
      y += 10;
    });
  } else {
    doc.text("No items available", 20, y + 2);
    y += 10;
  }

  // Order Summary
  y += 10;
  doc.setDrawColor(200, 200, 200);
  doc.line(120, y, pageWidth - 15, y);
  y += 8;

  doc.setFontSize(10);
  doc.text("Subtotal:", 130, y);
  doc.text(`₹${order.subtotal.toLocaleString("en-IN")}`, 180, y);
  y += 7;
  
  doc.text("Shipping:", 130, y);
  doc.text(`₹${order.shipping_cost.toLocaleString("en-IN")}`, 180, y);
  y += 7;

  doc.setDrawColor(200, 200, 200);
  doc.line(120, y, pageWidth - 15, y);
  y += 8;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL:", 130, y);
  doc.text(`₹${order.total.toLocaleString("en-IN")}`, 180, y);

  // Estimated Delivery
  if (order.estimated_delivery) {
    y += 15;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(`Estimated Delivery: ${order.estimated_delivery}`, 20, y);
  }

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 20;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text("Thank you for your order!", pageWidth / 2, footerY, { align: "center" });
  doc.text(`Generated on ${new Date().toLocaleDateString("en-IN")}`, pageWidth / 2, footerY + 5, { align: "center" });

  // Save the PDF
  doc.save(`${order.order_number}.pdf`);
};
