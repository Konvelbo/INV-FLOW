import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/">
      <Image
        id="logo_site"
        width={50}
        height={50}
        className="rounded-lg"
        src="/INV_LOGO.png"
        alt="Logo"
      />
    </Link>
  );
}
