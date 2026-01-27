-- Drop existing permissive policies on orders
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can view orders by order number" ON public.orders;

-- Drop existing permissive policies on order_items
DROP POLICY IF EXISTS "Anyone can create order items" ON public.order_items;
DROP POLICY IF EXISTS "Anyone can view order items" ON public.order_items;

-- Create restrictive RLS policies for orders (all access via edge functions only)
CREATE POLICY "Deny direct select on orders"
ON public.orders FOR SELECT
USING (false);

CREATE POLICY "Deny direct insert on orders"
ON public.orders FOR INSERT
WITH CHECK (false);

CREATE POLICY "Deny direct update on orders"
ON public.orders FOR UPDATE
USING (false);

CREATE POLICY "Deny direct delete on orders"
ON public.orders FOR DELETE
USING (false);

-- Create restrictive RLS policies for order_items (all access via edge functions only)
CREATE POLICY "Deny direct select on order_items"
ON public.order_items FOR SELECT
USING (false);

CREATE POLICY "Deny direct insert on order_items"
ON public.order_items FOR INSERT
WITH CHECK (false);

CREATE POLICY "Deny direct update on order_items"
ON public.order_items FOR UPDATE
USING (false);

CREATE POLICY "Deny direct delete on order_items"
ON public.order_items FOR DELETE
USING (false);