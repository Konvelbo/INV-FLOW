import { Skeleton } from "@/src/components/ui/skeleton";

export default async function Loading() {
    return (
        <div className="w-full h-400 flex justify-center items-center">
            <Skeleton className='w-250 h-400'/>

        </div>
    )
}