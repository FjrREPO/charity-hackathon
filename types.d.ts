interface Window {
    ethereum: any;
}

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