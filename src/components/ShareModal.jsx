import React, { useRef } from 'react';
import { X, MessageCircle, FileDown, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ShareModal({ products, role, totalPrice, totalBV, totalProfit, onClose }) {
  const [copied, setCopied] = React.useState(false);

  const buildText = () => {
    const lines = [
      `🛒 *Cotización HGW* — ${new Date().toLocaleDateString('es-MX')}`,
      `Rol: ${role}`,
      ``,
      ...products.map(p => `• ${p.name} — $${role === 'Master' ? p.master : p.dist} (${p.bv} BV)`),
      ``,
      `💰 Total: $${totalPrice}`,
      `📊 BV: ${totalBV}`,
      totalProfit ? `✅ Ganancia estimada: $${totalProfit}` : '',
      ``,
      `_Generado con Simulador HGW_`,
    ].filter(l => l !== null);
    return lines.join('\n');
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(buildText());
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(buildText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const win = window.open('', '_blank');
    win.document.write(`
      <html>
        <head>
          <title>Cotización HGW</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 32px; max-width: 600px; margin: 0 auto; color: #111; }
            h1 { color: #2563eb; font-size: 22px; margin-bottom: 4px; }
            .meta { color: #666; font-size: 13px; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th { background: #f3f4f6; text-align: left; padding: 8px 10px; font-size: 12px; color: #555; }
            td { padding: 8px 10px; border-bottom: 1px solid #e5e7eb; font-size: 13px; }
            .totals { background: #eff6ff; border-radius: 10px; padding: 16px 20px; }
            .totals div { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 14px; }
            .totals .main { font-size: 18px; font-weight: bold; color: #2563eb; }
            .profit { color: #059669; font-weight: bold; }
            footer { text-align: center; color: #aaa; font-size: 11px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <h1>🛒 Cotización HGW</h1>
          <div class="meta">Fecha: ${new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })} · Rol: ${role}</div>
          <table>
            <thead><tr><th>Producto</th><th>Precio</th><th>BV</th></tr></thead>
            <tbody>
              ${products.map(p => `<tr><td>${p.name}<br><small style="color:#999">${p.description || ''}</small></td><td>$${role === 'Master' ? p.master : p.dist}</td><td>${p.bv}</td></tr>`).join('')}
            </tbody>
          </table>
          <div class="totals">
            <div class="main"><span>Total</span><span>$${totalPrice}</span></div>
            <div><span>BV Total</span><span>${totalBV} BV</span></div>
            ${totalProfit ? `<div class="profit"><span>Ganancia estimada</span><span>$${totalProfit}</span></div>` : ''}
          </div>
          <footer>Generado con Simulador HGW</footer>
        </body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-sm border border-border" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-bold text-foreground">Compartir Cotización</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-4 space-y-3">
          <div className="bg-secondary/50 rounded-xl p-3 text-sm text-muted-foreground">
            <div className="font-medium text-foreground mb-1">{products.length} productos · ${totalPrice} · {totalBV} BV</div>
            {totalProfit > 0 && <div className="text-emerald-600 font-medium">Ganancia: ${totalProfit}</div>}
          </div>

          <button
            onClick={handleWhatsApp}
            className="w-full flex items-center gap-3 bg-[#25D366] hover:bg-[#1db954] text-white rounded-xl p-4 font-medium transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            <div className="text-left">
              <div className="font-semibold">Enviar por WhatsApp</div>
              <div className="text-xs opacity-80">Abre WhatsApp con el mensaje listo</div>
            </div>
          </button>

          <button
            onClick={handlePrint}
            className="w-full flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-4 font-medium transition-all"
          >
            <FileDown className="w-5 h-5" />
            <div className="text-left">
              <div className="font-semibold">Generar PDF / Imprimir</div>
              <div className="text-xs opacity-80">Abre la hoja lista para imprimir o guardar</div>
            </div>
          </button>

          <button
            onClick={handleCopy}
            className="w-full flex items-center gap-3 bg-secondary hover:bg-secondary/80 text-foreground rounded-xl p-4 font-medium transition-all border border-border"
          >
            {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
            <div className="text-left">
              <div className="font-semibold">{copied ? '¡Copiado!' : 'Copiar texto'}</div>
              <div className="text-xs text-muted-foreground">Para pegar en cualquier app</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
