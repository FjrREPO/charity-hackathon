import { ItemCard } from "@/components/cards/item-card";
import items from "@/data/items/items.json";

export const CardDonation = ({
    coins
}: {
    coins: CoinItem
}) => {

    return (
        <div className="w-full p-4">
            <div className="space-y-1">
                <div className="flex flex-row flex-wrap gap-5 justify-center">
                    {items.map((item: Item) => (
                        <ItemCard
                            key={item.id}
                            id={item.id}
                            name={item.name}
                            link={item.link}
                            image={item.image}
                            price={item.price}
                            source={item.source}
                            coins={coins}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
