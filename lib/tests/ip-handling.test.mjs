import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { stripTypeScriptTypes } from 'node:module'
import { timingSafeEqual } from 'node:crypto'
import { isIP } from 'node:net'
import vm from 'node:vm'
import { test, beforeEach } from 'node:test'

const source = readFileSync(new URL('../lib/rate-limit.ts', import.meta.url), 'utf8')
const script = stripTypeScriptTypes(source)
  .replace(/^import .* from .*\n/gm, '')
  .replace(/^export /gm, '')
const env = {
  NEXT_PUBLIC_SUPABASE_URL: 'https://bguzibvmgmcdeqemrdco.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY: 'sb_secret_LAlIUL_oslvLzB7971vseg_9jwY3yTL',
}
const calls = []
let rpcResult
let rpcFailure
let verifyRequest
let verifyResult
const context = vm.createContext({
  process: { env }, Buffer, timingSafeEqual, isIP, URL, URLSearchParams,
  console: { error() {} },
  createClient: () => ({ rpc(name, params) {
    calls.push({ name, params })
    return { async single() {
      if (rpcFailure) throw rpcFailure
      return rpcResult
    } }
  } }),
  fetch: async (url, options) => {
    verifyRequest = { url, options }
    return { ok: true, json: async () => verifyResult }
  },
})
vm.runInContext(script, context)
const secret = '12'.repeat(32)
const request = (headers = {}) => ({ headers: new Headers(headers) })
const trusted = (ip, extra = {}) => request({
  'x-mediacrater-proxy-secret': secret,
  'x-mediacrater-client-ip': ip,
  ...extra,
})

beforeEach(() => {
  env.CLOUDFLARE_PROXY_SECRET = secret
  env.TURNSTILE_SECRET_KEY = 'turnstile-test-only'
  calls.length = 0
  rpcResult = { data: { allowed: true, retry_after_seconds: 0 }, error: null }
  rpcFailure = null
  verifyResult = { success: true }
  verifyRequest = null
})

test('uses authenticated visitor IPv4 instead of Cloudflare or forged fallback headers', () => {
  assert.equal(context.clientIpFrom(trusted('203.0.113.9', {
    'x-forwarded-for': '172.69.130.46', 'x-real-ip': '162.158.127.19',
    'cf-connecting-ip': '192.0.2.99',
  })), '203.0.113.9')
})
test('two different visitors behind the same proxy retain different keys', () => {
  assert.notEqual(context.clientIpFrom(trusted('203.0.113.1')),
    context.clientIpFrom(trusted('203.0.113.2')))
})
test('the same visitor behind different proxies keeps the same key', () => {
  assert.equal(context.clientIpFrom(trusted('203.0.113.9', {
    'x-forwarded-for': '172.69.130.46',
  })), context.clientIpFrom(trusted('203.0.113.9', {
    'x-forwarded-for': '162.158.127.19',
  })))
})
test('canonicalizes expanded uppercase IPv6', () => {
  assert.equal(context.clientIpFrom(trusted('2001:0DB8:0000:0000:0000:0000:0000:0001')), '2001:db8::1')
})
test('normalizes IPv4-mapped IPv6 to its IPv4 key', () => {
  assert.equal(context.clientIpFrom(trusted('::ffff:203.0.113.9')), '203.0.113.9')
})
test('rejects direct requests despite forged visitor headers', () => {
  assert.throws(() => context.clientIpFrom(request({
    'x-mediacrater-client-ip': '203.0.113.9',
    'cf-connecting-ip': '203.0.113.9', 'x-forwarded-for': '203.0.113.9',
  })), /trusted proxy/)
})
test('rejects a correctly sized but incorrect credential', () => {
  assert.throws(() => context.clientIpFrom(trusted('203.0.113.9', {
    'x-mediacrater-proxy-secret': '34'.repeat(32),
  })), /trusted proxy/)
})
test('rejects malformed, duplicate and overly long credentials', () => {
  for (const credential of ['', 'invalid', secret + ', ' + secret, 'a'.repeat(4096)]) {
    assert.throws(() => context.clientIpFrom(trusted('203.0.113.9', {
      'x-mediacrater-proxy-secret': credential,
    })), /trusted proxy/)
  }
})
test('fails closed when server credential is absent or malformed', () => {
  for (const value of [undefined, '', 'short']) {
    env.CLOUDFLARE_PROXY_SECRET = value
    assert.throws(() => context.clientIpFrom(trusted('203.0.113.9')), /configuration/)
  }
})
test('fails closed on a missing visitor address', () => {
  assert.throws(() => context.clientIpFrom(request({
    'x-mediacrater-proxy-secret': secret, 'x-forwarded-for': '203.0.113.9',
  })), /valid client IP/)
})
test('rejects invalid IPs, address lists, port suffixes and scope identifiers', () => {
  for (const ip of ['unknown', '', '203.0.113.9, 203.0.113.10',
    '203.0.113.9:443', '[2001:db8::1]', 'fe80::1%eth0', '999.1.1.1']) {
    assert.throws(() => context.clientIpFrom(trusted(ip)), /valid client IP/)
  }
})
test('all current rate-limit actions pass the authenticated visitor IP to the existing RPC', async () => {
  for (const action of ['signup', 'signin', 'reset_password', 'resend_verification', 'solutions_form']) {
    const ip = context.clientIpFrom(trusted('203.0.113.9'))
    const result = await context.checkAndLogRateLimit(action, ip, 8, 120)
    assert.equal(result.allowed, true)
    const call = calls.at(-1)
    assert.equal(call.name, 'check_and_log_rate_limit')
    assert.equal(call.params.p_action, action)
    assert.equal(call.params.p_ip, ip)
    assert.equal(call.params.p_user_id, null)
    assert.equal(call.params.p_max_attempts, 8)
    assert.equal(call.params.p_window_seconds, 120)
  }
})
test('existing RPC denials retain their retry delay', async () => {
  rpcResult = { data: { allowed: false, retry_after_seconds: 17 }, error: null }
  const result = await context.checkAndLogRateLimit('signin', '203.0.113.9', 8, 120)
  assert.equal(result.allowed, false)
  assert.equal(result.retryAfterSeconds, 17)
})
test('RPC errors, malformed responses and thrown failures still fail closed', async () => {
  for (const result of [{ error: { message: 'unavailable' }, data: null },
    { error: null, data: { allowed: false, retry_after_seconds: 0 } },
    { error: null, data: { allowed: true, retry_after_seconds: -1 } }]) {
    rpcResult = result
    const outcome = await context.checkAndLogRateLimit('signin', '203.0.113.9', 8, 120)
    assert.equal(outcome.allowed, false)
    assert.ok(outcome.error)
  }
  rpcFailure = new Error('unavailable')
  assert.equal((await context.checkAndLogRateLimit('signin', '203.0.113.9', 8, 120)).allowed, false)
})
test('Turnstile receives the authenticated visitor IP and still requires verification', async () => {
  const ip = context.clientIpFrom(trusted('203.0.113.9'))
  assert.equal(await context.verifyTurnstileToken('test-token', ip), true)
  assert.equal(new URLSearchParams(verifyRequest.options.body).get('remoteip'), ip)
  assert.equal(await context.verifyTurnstileToken(null, ip), false)
  verifyResult = { success: false }
  assert.equal(await context.verifyTurnstileToken('bad-token', ip), false)
})
