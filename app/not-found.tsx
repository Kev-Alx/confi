import Image from "next/image";
import Link from "next/link";

import { ArrowLeft } from "lucide-react";

const Page = () => {
  return (
    <main className="w-full h-screen grid place-items-center">
      <div className="flex flex-col gap-4 items-center">
        <Image src={"/Confier.svg"} alt="logo" width={200} height={200} />
        <Image src={"/nf.png"} alt="success" width={200} height={200} />
        <h1 className="font-bold text-2xl">Uh oh! Page not found.</h1>
        <Link href={"/"} className="flex items-center gap-2">
          <ArrowLeft className="h-5 w-5" /> Go back...
        </Link>
      </div>
    </main>
  );
};

export default Page;
