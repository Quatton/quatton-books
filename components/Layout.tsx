import Link from "next/link";
import Breadcrumb from "./Breadcrumb";
import LangSelect from "./LanguageSelector";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="w-full h-screen flex flex-col select-none bg-gradient-to-tr from-indigo-200 via-red-200 to-yellow-100">
      <div className="absolute w-full flex flex-col items-center justify-between shadow-md z-50 backdrop-blur-sm">
        <div className="w-full flex items-center justify-between px-6 py-4">
          <Link href={`/`}>
            <a className="quatton text-amber-900 text-4xl font-semibold">
              Quatton
            </a>
          </Link>
          <span>
            <LangSelect />
          </span>
        </div>
        <div className="w-full px-4 py-2 h-12 flex items-center">
          <Breadcrumb />
        </div>
      </div>
      <div className="flex flex-col no-scrollbar w-full h-full overflow-y-auto overflow-x-hidden">
        <div className="w-full h-40"></div>
        {children}
      </div>
    </div>
  );
}
