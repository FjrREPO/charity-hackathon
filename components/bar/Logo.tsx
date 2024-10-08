import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href={"/"}
      className="flex items-center justify-start gap-2"
    >
      <Image src="https://res.cloudinary.com/dutlw7bko/image/upload/v1727915497/charity-hackathon/logo-ex_nh2w6g.jpg" alt="Logo" width={60} height={51} className="object-cover object-center rounded-lg w-auto h-auto"/>
    </Link>
  );
}
