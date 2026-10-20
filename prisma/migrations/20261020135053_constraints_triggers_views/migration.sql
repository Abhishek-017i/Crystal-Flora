-- 1. Domain & CHECK Constraints
ALTER TABLE "Product" 
  ADD CONSTRAINT check_product_price_non_negative CHECK (price >= 0),
  ADD CONSTRAINT check_product_stock_non_negative CHECK (stock >= 0),
  ADD CONSTRAINT check_product_discounted_price CHECK ("discountedPrice" IS NULL OR "discountedPrice" >= 0);

ALTER TABLE "Review"
  ADD CONSTRAINT check_review_rating_range CHECK (rating >= 1 AND rating <= 5);

ALTER TABLE "OrderItem"
  ADD CONSTRAINT check_order_item_quantity_positive CHECK (quantity > 0),
  ADD CONSTRAINT check_order_item_price_non_negative CHECK ("priceAtTime" >= 0);

ALTER TABLE "Order"
  ADD CONSTRAINT check_order_total_non_negative CHECK ("totalAmount" >= 0);

-- 2. Trigger: sync_is_in_stock
CREATE OR REPLACE FUNCTION trigger_sync_is_in_stock()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.stock <= 0 THEN
    NEW."isInStock" := false;
  ELSE
    NEW."isInStock" := true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS sync_is_in_stock ON "Product";
CREATE TRIGGER sync_is_in_stock
BEFORE INSERT OR UPDATE OF stock ON "Product"
FOR EACH ROW
EXECUTE FUNCTION trigger_sync_is_in_stock();

-- 3. View: v_seller_revenue
CREATE OR REPLACE VIEW v_seller_revenue AS
SELECT
  s.id AS "sellerId",
  s.name AS "sellerName",
  s.email AS "sellerEmail",
  COUNT(DISTINCT o.id)::INTEGER AS "totalOrders",
  COALESCE(SUM(oi.quantity), 0)::INTEGER AS "totalUnitsSold",
  COALESCE(SUM(oi.quantity * oi."priceAtTime"), 0)::FLOAT AS "totalRevenue"
FROM "Seller" s
LEFT JOIN "Product" p ON p."sellerId" = s.id
LEFT JOIN "OrderItem" oi ON oi."productId" = p.id
LEFT JOIN "Order" o ON o.id = oi."orderId" AND o.status != 'cancelled'
GROUP BY s.id, s.name, s.email;

-- 4. View: v_product_velocity
CREATE OR REPLACE VIEW v_product_velocity AS
SELECT
  p.id AS "productId",
  p.name AS "productName",
  c.name AS "categoryName",
  s.name AS "sellerName",
  p.stock AS "currentStock",
  p.price AS "price",
  COALESCE(SUM(oi.quantity), 0)::INTEGER AS "unitsSold",
  COALESCE(SUM(oi.quantity * oi."priceAtTime"), 0)::FLOAT AS "revenue"
FROM "Product" p
JOIN "Category" c ON c.id = p."categoryId"
JOIN "Seller" s ON s.id = p."sellerId"
LEFT JOIN "OrderItem" oi ON oi."productId" = p.id
LEFT JOIN "Order" o ON o.id = oi."orderId" AND o.status != 'cancelled'
GROUP BY p.id, p.name, c.name, s.name, p.stock, p.price
ORDER BY "unitsSold" DESC;