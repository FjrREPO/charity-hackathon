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

interface Quote {
    price: number;
    volume_24h: number;
    volume_change_24h: number;
    percent_change_1h: number;
    percent_change_24h: number;
    percent_change_7d: number;
    percent_change_30d: number;
    percent_change_60d: number;
    percent_change_90d: number;
    market_cap: number;
    market_cap_dominance: number;
    fully_diluted_market_cap: number;
    tvl: number | null;
    last_updated: string;
}

interface CryptoCurrency {
    id: number;
    name: string;
    symbol: string;
    slug: string;
    num_market_pairs: number;
    date_added: string;
    tags: string[];
    max_supply: number;
    circulating_supply: number;
    total_supply: number;
    infinite_supply: boolean;
    platform: null;
    cmc_rank: number;
    self_reported_circulating_supply: number | null;
    self_reported_market_cap: number | null;
    tvl_ratio: number | null;
    last_updated: string;
    quote: {
        USD: Quote;
    };
}