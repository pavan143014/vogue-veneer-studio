import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
  'Access-Control-Allow-Methods': 'GET, PATCH, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Get the authorization header to verify the user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the user's token and check if they're an admin
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user has admin role
    const { data: isAdmin } = await supabase.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin'
    });

    if (!isAdmin) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const url = new URL(req.url);
    const orderId = url.searchParams.get('order_id');

    // Handle PATCH request for updating order status
    if (req.method === 'PATCH') {
      if (!orderId) {
        return new Response(
          JSON.stringify({ error: 'order_id is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const body = await req.json();
      const { status } = body;

      const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
      if (!status || !validStatuses.includes(status)) {
        return new Response(
          JSON.stringify({ error: 'Invalid status. Valid values: ' + validStatuses.join(', ') }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data: updatedOrder, error: updateError } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating order:', updateError);
        return new Response(
          JSON.stringify({ error: 'Failed to update order status' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ order: updatedOrder, message: 'Order status updated successfully' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (orderId) {
      // Fetch specific order with items
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (orderError) {
        return new Response(
          JSON.stringify({ error: 'Order not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data: items } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);

      return new Response(
        JSON.stringify({ order: { ...order, items: items || [] } }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch all orders
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (ordersError) {
      console.error('Error fetching orders:', ordersError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch orders' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch order items for all orders
    const orderIds = (orders || []).map((o: any) => o.id);
    const { data: allItems } = orderIds.length > 0 
      ? await supabase.from('order_items').select('*').in('order_id', orderIds)
      : { data: [] };

    // Group items by order_id
    const itemsByOrder: Record<string, any[]> = {};
    (allItems || []).forEach((item: any) => {
      if (!itemsByOrder[item.order_id]) {
        itemsByOrder[item.order_id] = [];
      }
      itemsByOrder[item.order_id].push(item);
    });

    // Attach items to orders
    const ordersWithItems = (orders || []).map((order: any) => ({
      ...order,
      items: itemsByOrder[order.id] || []
    }));

    return new Response(
      JSON.stringify({ orders: ordersWithItems }),
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
