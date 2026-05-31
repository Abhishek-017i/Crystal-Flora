'use client';

interface OrderSummaryProps {
  subtotal: number;
  shipping?: number;
  total: number;
}

export function OrderSummary({ subtotal, shipping = 0, total }: OrderSummaryProps) {
  return (
    <div className="bg-card rounded-lg p-4 border border-border">
      <h3 className="text-sm font-semibold text-foreground mb-4">Order Summary</h3>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="text-foreground">₹{subtotal.toFixed(2)}</span>
        </div>
        
        {shipping > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span className="text-foreground">₹{shipping.toFixed(2)}</span>
          </div>
        )}
        
        {shipping === 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span className="text-xs" style={{ color: '#d4869f' }}>Calculated at checkout</span>
          </div>
        )}
      </div>

      <div className="border-t border-border pt-4">
        <div className="flex justify-between">
          <span className="font-semibold text-foreground">Total</span>
          <span className="text-lg font-bold" style={{ color: '#d4869f' }}>₹{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
