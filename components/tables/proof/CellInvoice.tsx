import { TableRHF } from "@/app/(client)/proof/_components/TableProof"
import { useFormContext } from "react-hook-form"


const CellInvoice = ({
    index
}: {
    index: number
}) => {
    const {
        register
    } = useFormContext<TableRHF>()

    return (
        <div className="text-sm">
            <input
                {...register(`invoices.${index}.value`)}
                type="text"
                className="w-full rounded-lg bg-gray-400/5 p-2 text-center font-medium"
            />
        </div>
    )
}

export default CellInvoice