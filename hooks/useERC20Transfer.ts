import { writeContract } from '@wagmi/core'
import { config } from '@/lib/wagmi/config'
import { erc20Abi } from 'viem'

export const useERC20Transfer = async (token: HexAddress, to: HexAddress, amount: number) => {
    const result = await writeContract(config, {
        abi: erc20Abi,
        address: token,
        functionName: 'transfer',
        args: [
            to,
            BigInt(amount),
        ],
    })

    return result
}