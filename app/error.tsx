"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/src/components/ui/card";
import Link from "next/link";

function Error() {
  return (
    <Card>
      <CardTitle>Error</CardTitle>
      <CardContent>
        <p>An error has occurred.</p>
      </CardContent>
      <CardFooter>
        <Link href="/" />
      </CardFooter>
    </Card>
  );
}
export default Error;
