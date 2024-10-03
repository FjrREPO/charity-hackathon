import { cookieStorage, createStorage } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, arbitrum } from '@reown/appkit/networks'

export const projectId = '5ddd7af254a18f6f1758ccb547715ef8'

if (!projectId) {
    throw new Error('Project ID is not defined')
}

export const networks = [mainnet, arbitrum]

export const wagmiAdapter = new WagmiAdapter({
    storage: createStorage({
        storage: cookieStorage
    }),
    ssr: true,
    projectId,
    networks
})

export const config = wagmiAdapter.wagmiConfig