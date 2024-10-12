import { NextRequest, NextResponse } from 'next/server';
import { ReclaimClient } from "@reclaimprotocol/zk-fetch";
import {
    transformForOnchain,
    verifyProof,
} from "@reclaimprotocol/js-sdk";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        // invoice from id item
        const { invoice } = body;

        if (!invoice) {
            return NextResponse.json({ error: "Missing invoice" }, { status: 400 });
        }

        const reclaimId = process.env.RECLAIM_ID;
        const reclaimSecret = process.env.RECLAIM_SECRET;
        const verifyUrl = process.env.API_PROOF_URL;

        if (!reclaimId || !reclaimSecret) {
            return NextResponse.json({ error: "Missing reclaim credentials" }, { status: 400 });
        }

        if (!verifyUrl) {
            return NextResponse.json({ error: 'Missing verify URL' }, { status: 400 });
        }

        const client = new ReclaimClient(reclaimId, reclaimSecret);

        const publicOptions = {
            method: 'GET',
            headers: {
                accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            }
        };

        const proof = await client.zkFetch(
            "https://run.mocky.io/v3/81c98130-f8a8-4b38-9ab8-284df41f7829",
            publicOptions,
            {
                responseMatches: [
                    {
                        "type": "regex",
                        "value": "\"id\":\\s*(?<id>[\\d.]+)"
                    }
                ],
            }
        );

        if (!proof) {
            return NextResponse.json({ error: 'Failed to generate proof' }, { status: 500 });
        }

        const isProofVerified = await verifyProof(proof);
        const proofData = transformForOnchain(proof);

        return NextResponse.json({
            proofData,
            isProofVerified,
        });
    } catch (error) {
        console.error('Error in /api/proof:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
