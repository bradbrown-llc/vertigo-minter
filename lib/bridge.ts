import { Signer } from 'https://cdn.jsdelivr.net/gh/bradbrown-llc/vertigo@0.0.16/lib/Signer.ts'

const secret = Deno.env.get('BRIDGE_SECRET')
if (!secret) throw new Error('missing required env var \'BRIDGE_SECRET\'')

export const bridge = new Signer(secret)