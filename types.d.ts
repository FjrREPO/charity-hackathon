interface Window {
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

interface Foundation {
    title: string;
    thumbnail: string;
}

interface TransactionAlchemy {
    contractAddresses: string;
    category: string[];
    fromAddress: string;
    toAddress: string;
    excludeZeroValue: boolean;
}

interface ProofItem {
    id: number;
    account: string;
    to: string;
    value: number;
    hash: string;
    timestamp: number;
}

interface RawContractTransferHistory {
    value: string;
    address: string | null;
    decimal: string;
}

interface TransactionTransferHistory {
    blockNum: string;
    uniqueId: string;
    hash: string;
    from: string;
    to: string;
    value: number;
    erc721TokenId: string | null;
    erc1155Metadata: string | null;
    tokenId: string | null;
    asset: string;
    category: string;
    rawContract: RawContract;
}

interface TransactionContract {
    account: string;
    productId: number;
    timestamp: number;
    marketplaceId: number;
    proved: boolean;
    link: string;
    transactionId: number;
}

interface Signature {
    signature: string;
    signer: string;
}