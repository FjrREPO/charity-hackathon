import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(
    request: Request
) {
    const body = await request.json();

    const { idCrypto } = body

    const response = await axios.get(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?id=${idCrypto}`, {
        headers: {
            'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API,
        }
    });

    if (response.status === 200) {
        const data = response.data;
        return NextResponse.json(data || { message: 'Item not found' });
    } else {
        return NextResponse.json({ error: `Error: ${response.status}` }, { status: response.status });
    }
}