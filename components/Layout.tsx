import Link from "next/link";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div>
      <div>
        <Link href="/">Quatton</Link>
      </div>

      <div>{children}</div>
    </div>
  );
}
