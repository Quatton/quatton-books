import Link from "next/link";
import LangSelect from "./LanguageSelector";
import CPModal from "./CPModal";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="relative h-screen flex flex-col">
      <div className="flex items-center justify-between shadow-md px-6 py-4 z-50 bg-camel">
        <Link href={`/`}>
          <a className="quatton text-amber-900 text-4xl font-semibold">Quatton</a>
        </Link>

        <span>
          <LangSelect />
        </span>
      </div>

      <CPModal />

      <div className="relative h-full overflow-y-auto no-scrollbar bg-amber-50 flex flex-col">
        {children}
      </div>
    </div>
  );
}
