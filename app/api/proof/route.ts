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
      method: "GET",
      headers: {
        accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
    };

    // {
    //     "id": 1,
    //     "name": "Paket setelan 6 pcs anak laki-laki perempuan unisex usia 0 - 7 Tahun - CEWEK SEMUA, S",
    //     "link": "https://www.tokopedia.com/foyakids/paket-setelan-6-pcs-anak-laki-laki-perempuan-unisex-usia-0-7-tahun-cewek-semua-s-b81cf",
    //     "image": "https://images.tokopedia.net/img/cache/700/VqbcmM/2023/12/14/e5403d71-aed3-4560-9ac6-b7be1623ac74.jpg",
    //     "price": 0.0001,
    //     "source": "Tokopedia"
    //   }

    const link = `https://defiant-morna-rosyid-7ea20110.koyeb.app/api/donation/1`;
    const proof = await client
      .zkFetch(link, publicOptions, {
        responseMatches: [
          {
            type: "regex",
            value: '.*"id":\\s(?<id>\\d+),.*',
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
    const proofData = transformForOnchain(proof);

    console.log("Proof data:", proof);

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
