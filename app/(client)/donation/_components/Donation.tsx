"use client";

import coins from "@/data/coins/coins.json";
import { Label } from "@/components/ui/label";
import { AnimatePresence, motion } from "framer-motion";
import items from "@/data/items/items.json";
import { CardDonation } from "./CardDonation";

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
};

export const Donation = () => {

    // const data = useReadContract({
    //     abi: donationABI,
    //     address: MAIN_ADDRESS,
    //     functionName: 'verifyProof',
    //     args: [
    //         { "claimInfo": { "context": "{\"extractedParameters\":{\"id\":\"1091\"},\"providerHash\":\"0x05366449ad6942261c28fafd61e6e43478d94c791e69989ef1190f2232bf09a6\"}", "parameters": "{\"body\":\"\",\"method\":\"GET\",\"responseMatches\":[{\"type\":\"regex\",\"value\":\"\\\"id\\\":\\\\s*(?<id>[\\\\d.]+)\"}],\"responseRedactions\":[],\"url\":\"https://run.mocky.io/v3/6603a074-4de8-42bc-8ffa-aed28392340e\"}", "provider": "http" }, "signedClaim": { "claim": { "epoch": 1, "identifier": "0x06fe7e89af07887202642887f7b11acc1062bdc5ca4b0068561e1e5cc1407bf4", "owner": "0x25fbe989e84695177771f2d9d797605162fbfd55", "timestampS": 1728746957 }, "signatures": ["0x5a2a3cd91f8180e417735f4dec64a7aa7c7b4f466c93676dd1e8070e63bbb6715ba769bd6cb52fbc06bcff68ba2804a40ccbef845beb7b8fd31b2ce1ce2c0a471c"] } }
    //     ],
    // });

    // console.log("dataMarketplace = ", data.data);
    return (
        <div className="w-full p-4">
            <div className="flex flex-col space-y-2">
                <div className="flex flex-col w-full justify-center items-center gap-2">
                    <Label className="text-3xl font-bold">
                        <Label className="text-textSecondary text-3xl font-bold">Crypto</Label>&nbsp;Donation
                    </Label>
                    <Label>Select an item to start donation</Label>
                </div>
                <AnimatePresence mode="wait">
                    <div className="w-full p-4">
                        <div className="space-y-1">
                            <div className="flex flex-row flex-wrap gap-5 justify-center">
                                {items.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        variants={cardVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        transition={{
                                            duration: 0.5,
                                            delay: index * 0.25,
                                        }}
                                    >
                                        <CardDonation
                                            id={item.id}
                                            name={item.name}
                                            link={item.link}
                                            image={item.image}
                                            price={item.price}
                                            source={item.source}
                                            coins={coins}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </AnimatePresence>
            </div>
        </div>
    );
};
