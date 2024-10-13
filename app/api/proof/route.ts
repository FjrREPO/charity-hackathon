import { NextRequest, NextResponse } from 'next/server';
import { ReclaimClient } from "@reclaimprotocol/zk-fetch";
import {
    transformForOnchain,
    verifyProof,
} from "@reclaimprotocol/js-sdk";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { itemId } = body;

        if (!itemId) {
            return NextResponse.json({ error: "Missing itemId" }, { status: 400 });
        }

        const reclaimId = process.env.RECLAIM_ID;
        const reclaimSecret = process.env.RECLAIM_SECRET;

        if (!reclaimId || !reclaimSecret) {
            return NextResponse.json({ error: "Missing reclaim credentials" }, { status: 400 });
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
            `https://defiant-morna-rosyid-7ea20110.koyeb.app/api/donation/${itemId}`,
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
        if (!isProofVerified) {
            return NextResponse.json({ error: 'Failed to verify proof' }, { status: 500 });
        }

        const proofData = transformForOnchain(proof);

        return NextResponse.json({proofData});
    } catch (error) {
        console.error('Error in /api/proof:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
