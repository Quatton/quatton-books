import { useRouter } from "next/router";
import BookModal from "./BookModal";

type Props = {};

export default function CPModal({}: Props) {
  const router = useRouter();
  const { query } = router;
  if (typeof query.a !== "string" && typeof query.a !== "boolean") return null;

  return (
    <div
      className="s
      absolute flex items-center justify-center
      w-full h-full z-30 bg-neutral-900/70 overflow-hidden"
    >
      <BookModal />
    </div>
  );
}
