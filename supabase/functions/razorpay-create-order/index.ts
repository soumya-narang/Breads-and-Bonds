import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { amount, currency = 'INR', receipt = `receipt_${Date.now()}` } = await req.json()

    const RAZORPAY_KEY_ID = Deno.env.get('RAZORPAY_KEY_ID')
    const RAZORPAY_KEY_SECRET = Deno.env.get('RAZORPAY_KEY_SECRET')

    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay keys are missing in Edge Function environment variables')
    }

    const keySecretBase64 = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`)

    // Create an order via Razorpay REST API
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${keySecretBase64}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // amount is expected in paise (multiply by 100)
        currency,
        receipt,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Razorpay Error:', errorText)
      throw new Error(`Razorpay API Error: ${errorText}`)
    }

    const data = await response.json()

    // Send the generated order_id back to the frontend
    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error: any) {
    console.error('Edge Function Error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
