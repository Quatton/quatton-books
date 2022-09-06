import Link from "next/link";
import { useRouter } from "next/router";

type Props = {};

export default function BookCover({}: Props) {
  const id = Math.floor(Math.random() * 16777215).toString(16);
  const backgroundColor = "#" + id;
  const router = useRouter();
  const { pathname } = router;

  const shallowPush = () => {
    router.push({ pathname, query: { p: id } }, pathname, { shallow: true });
  };

  return (
    <div
      onClick={() => shallowPush()}
      className="
        w-36 h-36 aspect-square drop-shadow-md
        rounded-lg hover:ring-2 ring-amber-500 cursor-pointer
        flex items-center justify-center"
      style={{ backgroundColor }}
    >
      <h1 className={`text-xl ${parseInt(id) > 8 * 8 * 8 && "text-white"}`}>
        {backgroundColor}
      </h1>
    </div>
  );
}
