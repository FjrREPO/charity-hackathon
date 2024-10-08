import { cookieStorage, createStorage } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, arbitrum, aurora, avalanche, base, baseSepolia, celo, gnosis, optimism, polygon, sepolia, solana, solanaDevnet, solanaTestnet, zkSync, zora } from '@reown/appkit/networks'

export const projectId = '04251f8180896efb96c57a0984864657'

if (!projectId) {
    throw new Error('Project ID is not defined')
}

export const networks = [
    mainnet,
    arbitrum,
    avalanche,
    base,
    optimism,
    polygon,
    gnosis,
    zkSync,
    zora,
    celo,
    base,
    aurora,
    baseSepolia,
    solana,
    solanaDevnet,
    solanaTestnet,
    sepolia
]

export const wagmiAdapter = new WagmiAdapter({
    storage: createStorage({
        storage: cookieStorage
    }),
    ssr: true,
    projectId,
    networks
})

export const config = wagmiAdapter.wagmiConfig