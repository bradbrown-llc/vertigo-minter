import { kvv } from './lib/kvv.ts'
import { ejra } from './lib/ejra.ts'
import { Mint } from '../vertigo/lib/Mint.ts'
import { processId } from './lib/processId.ts'
import { bridge } from './lib/bridge.ts'
import { tokenAddress } from './lib/tokenAddress.ts'
import { err } from './lib/err.ts'
import { out } from './lib/out.ts'

async function handleMint(mint:Mint) {
    const active = await mint.active()
    const state = await mint.state()
    if (state === 'sendable' && active === true) await mint.send(bridge, tokenAddress)
    if (state === 'sendable' && active === false) await mint.move('archive')
    await mint.unclaim(processId)
}

while (true) {

    const processing = await Mint.nextProcessing(processId, kvv, ejra, { err, out })
    if (processing instanceof Mint) { await handleMint(processing); continue }

    const mint = await Mint.next('sendable', kvv, ejra, { err, out })
    if (mint instanceof Error || mint === null) continue
    const claimed = await mint.claim(processId)
    console.log({ claimed })
    if (claimed instanceof Error || claimed === false) continue
    await handleMint(mint)
    
}