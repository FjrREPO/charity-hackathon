import { USDC_ADDRESS } from "@/lib/abi/config";
import { ethers } from "ethers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.json();
    const { fromAddress, amount } = body;

    // Convert the amount to the correct units for USDC (6 decimals)
    const amountConverted = ethers.utils.parseUnits(amount.toString(), 6);

    // Create a provider and a signer
    const provider = new ethers.providers.AlchemyProvider('homestead', process.env.ALCHEMY_API_KEY);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
    
    // Create a contract instance
    const usdcContract = new ethers.Contract(USDC_ADDRESS, [
        "function transfer(address to, uint amount) returns (bool)"
    ], wallet);

    try {
        // Send the transaction
        const tx = await usdcContract.transfer(process.env.TO_ADDRESS!, amountConverted);
        console.log("Transaction =>", tx);

        // Wait for the transaction to be mined
        const receipt = await tx.wait();
        console.log("Transaction receipt =>", receipt);

        return NextResponse.json({ success: true, txHash: receipt.transactionHash });
    } catch (error) {
        console.error("Error sending transaction =>", error);
    }
}
