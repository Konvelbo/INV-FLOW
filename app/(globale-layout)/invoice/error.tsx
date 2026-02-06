"use client";

import { Alert, AlertTitle } from "@/src/components/ui/alert";
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/src/components/ui/card";
import { InfoIcon } from "lucide-react";
import Link from "next/link";

export default function DasboardError() {
  return (
      <Alert>
        <InfoIcon/>
        <AlertTitle>Invoice Error</AlertTitle>
        <Link  href="/"/>
      </Alert>
  );
}
