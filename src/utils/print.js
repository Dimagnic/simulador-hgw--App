export const printSelection = (products, role, totalMXN, totalBV) => {
  const date = new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });
  
  const html = `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>HGW México - Lista de Productos</title>
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
        <style>
          body { 
            font-family: 'Nunito', sans-serif; 
            color: #333; 
            margin: 0;
            padding: 20px;
          }
          .header { 
            text-align: center; 
            margin-bottom: 30px; 
            border-bottom: 2px solid #1D9E75;
            padding-bottom: 20px;
          }
          .header h2 {
            color: #1D9E75;
            margin: 0 0 10px 0;
            font-size: 24px;
          }
          .header p {
            margin: 0;
            color: #666;
            font-size: 14px;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 20px; 
            font-size: 14px;
          }
          th, td { 
            border: 1px solid #e5e5e5; 
            padding: 10px 12px; 
            text-align: left; 
          }
          th { 
            background-color: #1D9E75; 
            color: white; 
            font-weight: 600;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          .null-price {
            color: #888;
            font-style: italic;
          }
          .total-row { 
            font-weight: bold; 
            background-color: #e8f5f0 !important; 
          }
          .total-row td {
            border-top: 2px solid #1D9E75;
          }
          .footer { 
            text-align: center; 
            margin-top: 50px; 
            font-size: 12px; 
            color: #888; 
            border-top: 1px solid #eee;
            padding-top: 20px;
          }
          @media print {
            body { padding: 0; }
            @page { margin: 1.5cm; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>HGW México — Lista de Productos</h2>
          <p>Rol: <strong>${role}</strong> | Fecha: ${date} | Productos: ${products.length}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Precio (MXN)</th>
              <th>BV</th>
            </tr>
          </thead>
          <tbody>
            ${products.map(p => {
              const price = role === 'Master' ? p.master : p.dist;
              const displayPrice = price === null ? '<span class="null-price">Sin precio</span>' : `$${price}`;
              return `
              <tr>
                <td>${p.id}</td>
                <td>
                  ${p.name}<br>
                  <small style="color: #666;">${p.description}</small>
                </td>
                <td>${p.category}</td>
                <td>${displayPrice}</td>
                <td>${p.bv}</td>
              </tr>
            `;
            }).join('')}
            <tr class="total-row">
              <td colspan="3" style="text-align: right;">TOTAL:</td>
              <td>$${totalMXN}</td>
              <td>${totalBV}</td>
            </tr>
          </tbody>
        </table>
        <div class="footer">
          Lista de Precios México — Febrero 2026 | Green World Group
        </div>
        <script>
          window.onload = () => {
            setTimeout(() => {
              window.print();
            }, 500);
          };
        </script>
      </body>
    </html>
  `;
  
  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
};