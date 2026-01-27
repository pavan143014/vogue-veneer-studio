import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OrderItem {
  product_id: string;
  product_title: string;
  variant_id: string;
  variant_title?: string;
  price: number;
  quantity: number;
  image_url?: string;
  selected_options?: Record<string, string>[];
}

interface CreateOrderRequest {
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
  currency?: string;
  shopify_checkout_url?: string;
  estimated_delivery?: string;
  items: OrderItem[];
}

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function sanitizeString(str: string, maxLength: number = 500): string {
  return str.trim().substring(0, maxLength);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const body: CreateOrderRequest = await req.json();

    // Validate required fields
    if (!body.full_name || !body.email || !body.address || !body.city || !body.state || !body.pincode) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: full_name, email, address, city, state, pincode' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!validateEmail(body.email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!body.items || body.items.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Order must contain at least one item' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate numeric values
    if (typeof body.subtotal !== 'number' || body.subtotal < 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid subtotal' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (typeof body.total !== 'number' || body.total < 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid total' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const orderNumber = generateOrderNumber();

    console.log('Creating order:', orderNumber);

    // Create the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        full_name: sanitizeString(body.full_name, 200),
        email: sanitizeString(body.email, 255).toLowerCase(),
        phone: body.phone ? sanitizeString(body.phone, 20) : null,
        address: sanitizeString(body.address, 500),
        city: sanitizeString(body.city, 100),
        state: sanitizeString(body.state, 100),
        pincode: sanitizeString(body.pincode, 20),
        subtotal: body.subtotal,
        shipping_cost: body.shipping_cost || 0,
        total: body.total,
        currency: body.currency || 'INR',
        shopify_checkout_url: body.shopify_checkout_url || null,
        estimated_delivery: body.estimated_delivery || null,
        status: 'pending',
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      return new Response(
        JSON.stringify({ error: 'Failed to create order' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create order items
    const orderItems = body.items.map((item) => ({
      order_id: order.id,
      product_id: sanitizeString(item.product_id, 100),
      product_title: sanitizeString(item.product_title, 500),
      variant_id: sanitizeString(item.variant_id, 100),
      variant_title: item.variant_title ? sanitizeString(item.variant_title, 200) : null,
      price: item.price,
      quantity: item.quantity,
      image_url: item.image_url ? sanitizeString(item.image_url, 1000) : null,
      selected_options: item.selected_options || null,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Order items creation error:', itemsError);
      // Rollback: delete the order if items failed
      await supabase.from('orders').delete().eq('id', order.id);
      return new Response(
        JSON.stringify({ error: 'Failed to create order items' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Order created successfully:', orderNumber);

    return new Response(
      JSON.stringify({
        success: true,
        order: {
          id: order.id,
          order_number: order.order_number,
          status: order.status,
          total: order.total,
          currency: order.currency,
          created_at: order.created_at,
          estimated_delivery: order.estimated_delivery,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
