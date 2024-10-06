import { Alchemy, Network } from 'alchemy-sdk';

const ALCHEMY_API_KEY = "vwDTCZX0XZnU6flxj8YzYZuMaOKI3EX9";

const alchemy = new Alchemy({
    apiKey: ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
});

export async function simulateTransaction(fromAddress: string, toAddress: string, value: string) {
    try {
        const gasEstimate = await alchemy.core.estimateGas({
            from: fromAddress,
            to: toAddress,
            value: value,
        });

        const gasPrice = await alchemy.core.getGasPrice();
        
        const gasPriceInGwei = parseInt(gasPrice.toString()) / 1e9;
        
        const totalGasCostWei = gasEstimate.mul(gasPrice);
        const totalGasCostEth = parseFloat(totalGasCostWei.toString()) / 1e18;

        return {
            gasLimit: gasEstimate.toString(),
            gasPrice: gasPriceInGwei,
            totalGasCost: totalGasCostEth,
            success: true,
        };
    } catch (error) {
        console.error('Error simulating transaction:', error);
        let errorMessage = 'Unknown error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        throw new Error(`Simulation failed: ${errorMessage}`);
    }
}