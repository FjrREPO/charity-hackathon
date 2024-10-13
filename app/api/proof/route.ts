import { NextRequest, NextResponse } from "next/server";
import { ReclaimClient } from "@reclaimprotocol/zk-fetch";
import { transformForOnchain, verifyProof } from "@reclaimprotocol/js-sdk";

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
      return NextResponse.json(
        { error: "Missing reclaim credentials" },
        { status: 400 }
      );
    }

    if (!verifyUrl) {
      return NextResponse.json(
        { error: "Missing verify URL" },
        { status: 400 }
      );
    }

    const client = new ReclaimClient(reclaimId, reclaimSecret);

    const publicOptions = {
      method: "POST",
      headers: {
        accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        invoiceId: invoice,
      }),
    };

    const link = `https://defiant-morna-rosyid-7ea20110.koyeb.app/verify-tokopedia`;
    const proof = await client
      .zkFetch(link, publicOptions, {
        responseMatches: [
          {
            type: "regex",
            value: '.*"invoiceId":\\s(?<id>\\d+).*',
          },
        ],
      })
      .catch((error) => {
        console.error("Error in /api/proof:", error);
        return null;
      });

    if (!proof) {
      return NextResponse.json(
        { error: "Failed to generate proof" },
        { status: 500 }
      );
    }

    const isProofVerified = await verifyProof(proof);
    if (!isProofVerified) {
      return NextResponse.json(
        { error: "Failed to verify proof" },
        { status: 500 }
      );
    }

    const proofData = transformForOnchain(proof);

    return NextResponse.json({
      proofData,
      isProofVerified,
    });
  } catch (error) {
    console.error("Error in /api/proof:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
