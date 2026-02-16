import {Alert} from "@/src/components/ui/alert"
export default async function notFound() {
    return(
        <Alert>
        <InfoIcon/>
        <AlertTitle>Invoice Error</AlertTitle>
        <Link  href="/"/>
      </Alert>
    )
}