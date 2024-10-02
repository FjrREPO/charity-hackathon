// app/api/coins/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
    try {
        const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
            headers: {
                'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API,
            },
            params: {
                start: '1',
                limit: '10',
                convert: 'USD',
            },
        });

        if (response.status === 200) {
            const data = response.data.data;
            return NextResponse.json(data || { message: 'Item not found' });
        } else {
            return NextResponse.json({ error: `Error: ${response.status}` }, { status: response.status });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
