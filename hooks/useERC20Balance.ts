import { readContract } from "@wagmi/core";
import { config } from "@/lib/wagmi/config";
import { abiBalance } from "@/lib/abi/abiBalance";

export const useERC20Balance = async (address: HexAddress, token: any) => {
    const result = await readContract(config, {
        address: token,
        abi: abiBalance,
        functionName: 'balanceOf',
        args: [address],
    });
    return result;
};
