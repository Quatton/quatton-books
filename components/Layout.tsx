import Link from "next/link";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="">
      <div className="shadow-md px-6 py-4">
        <Link href="/">
          <a className="quatton text-4xl font-semibold hover:drop-shadow-sm">
            Quatton
          </a>
        </Link>
      </div>

      <div>{children}</div>
    </div>
  );
}
