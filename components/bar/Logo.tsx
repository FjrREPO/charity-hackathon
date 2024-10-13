import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href={"/"}
      className="flex items-center justify-start gap-2"
    >
      <Image src="https://res.cloudinary.com/dutlw7bko/image/upload/v1728721738/charity-hackathon/logo-musang_raixov.png" alt="Logo" width={60} height={51} className="object-cover object-center rounded-lg w-auto h-auto"/>
    </Link>
  );
}
