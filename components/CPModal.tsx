import { useRouter } from "next/router";
import BookModal from "./BookModal";

type Props = {};

export default function CPModal({}: Props) {
  const router = useRouter();
  const { pathname, query } = router;
  if (typeof query.p !== "string") return null;

  const shallowPush = () => {
    router.push(pathname, pathname, { shallow: true });
  };

  return (
    <div className="absolute flex items-center justify-center w-full h-full z-30 overflow-hidden">
      <span
        onClick={() => shallowPush()}
        className="absolute flex items-center justify-center w-full h-full bg-neutral-900/70 cursor-pointer"
      ></span>
      <BookModal />
    </div>
  );
}
