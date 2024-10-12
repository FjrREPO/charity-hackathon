export const USDC_ABI = [
    {
        inputs: [
            { name: "to", type: "address" },
            { name: "value", type: "uint256" }
        ],
        name: "transfer",
        outputs: [{ name: "", type: "bool" }],
        type: "function"
    }
] as const;

export const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

export const MAIN_ADDRESS = "0xcc09b454dce7d17af9a4e6bce4f34c7733df6117"

export const RECIPIENT_ADDRESS = "0x3b4f0135465d444a5bd06ab90fc59b73916c85f5";