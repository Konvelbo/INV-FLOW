import { Alert, AlertTitle } from "@/src/components/ui/alert";
import { InfoIcon } from "lucide-react";
import Link from "next/link";

export default async function notFound() {
  return (
    <Alert>
      <InfoIcon />
      <AlertTitle>Invoice Error</AlertTitle>
      <Link href="/" className="text-primary hover:underline">
        Retour à l'accueil
      </Link>
    </Alert>
  );
}
