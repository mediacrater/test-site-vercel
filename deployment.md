Checklist before pushing TEST code to LIVE:

VPS / Server

.env has live SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
.env has live STRIPE_SECRET_KEY (sk_live_...)
.env has live STRIPE_WEBHOOK_SECRET
.env has live OPENROUTER_KEY
PORT is set to 3000
checkout.js CORS origins include https://mediacrater.com and live Vercel URL, not test URLs
server.js allowed origins include live extension ID (fgekklkpomdcadiaekpigidkimnkjpnf), not test IDs
 pm2 is running mediacrater-api not mediacrater-api-test


Supabase Edge Functions (live project)

create-checkout has live Stripe price IDs
create-checkout secrets: live STRIPE_SECRET_KEY
stripe-webhook secrets: live STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET
stripe-webhooksuccess_url points to https://mediacrater.com/purchase-success
stripe-webhookcancel_url points to https://mediacrater.com/buy-tokens


Chrome Extension

supabase.jsSUPABASE_URL is live project URL
supabase.jsSUPABASE_ANON_KEY is live anon key
supabase.jsVPS_URL is https://host.mediacrater.com
 Extension manifest version number bumped
 Test extension ID (ikgpaddfkchnafcgdcecgmolfapgdfnf) removed from server CORS allowed origins


Stripe

 Webhook endpoint points to live Supabase Edge Function URL, not test
 Live price IDs match what's in create-checkout
 Test mode toggle is OFF in Stripe dashboard


Website (Vercel)

NEXT_PUBLIC_SUPABASE_URL is live project
NEXT_PUBLIC_SUPABASE_ANON_KEY is live anon key
 Any Stripe public keys are live (pk_live_...)


Final verification after deploying:

/health endpoint returns connected
 Test login works in live extension
 Test a free scan works end to end
 Check Slack alert channel for any unexpected errors after deploy
