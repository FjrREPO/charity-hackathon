// app/api/coins/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
    const url = 'https://api.normi.es/api/v1/coins/buy';
    const headers = {
        accept: '*/*',
        'accept-language': 'en',
        priority: 'u=1, i',
        'sec-ch-ua': '"Brave";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        'sec-gpc': '1',
        'x-blockchain-type': '',
        Referer: 'https://ramps.normi.es/',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
    };

    try {
        const response = await axios.get(url, { headers });

        if (response.status === 200) {
            const data = response.data;
            return NextResponse.json(data || { message: 'Item not found' });
        } else {
            return NextResponse.json({ error: `Error: ${response.status}` }, { status: response.status });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
