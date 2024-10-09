interface Window {
    ethereum: any;
    chrome?: {
        cookieStore?: CookieStore;
    };
}

type HexAddress = `0x${string}`;

interface CoinItem {
    id: string;
    symbol: string;
    name: string;
    network: string;
    network_symbol: string;
    chain_id: number;
    is_maintenance: boolean;
    is_token: boolean;
    contract_address: string;
    decimals: number;
    max_trade_decimals: number;
    image: string;
}

interface Item {
    id: number;
    name: string;
    link: string;
    image?: string;
    foundation?: string;
    price: number;
    source: string;
    coins?: CoinItem;
}

interface TransactionAlchemy {
    contractAddresses: string;
    category: string[];
    fromAddress: string;
    toAddress: string;
    excludeZeroValue: boolean;
}