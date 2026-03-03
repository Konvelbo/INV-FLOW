import Image from "next/image";
import Link from "next/link";
import { JSX } from "react";

export default function Logo({
  className,
  w,
  h,
  logoUrl,
}: {
  className?: string;
  w: number;
  h: number;
  logoUrl: string;
}): JSX.Element {
  return (
    <Link className={className} href="/">
      <Image
        id="logo_site"
        width={w || 45}
        height={h || 45}
        className="rounded-lg"
        src={logoUrl}
        alt="Logo"
      />
    </Link>
  );
}
