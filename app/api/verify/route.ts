import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { invoice } = body;

        const regexPattern = new RegExp(`^${invoice}$`);

        return NextResponse.json(regexPattern.test(invoice));
    } catch (error) {
        console.error('Error in /api/verify:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
