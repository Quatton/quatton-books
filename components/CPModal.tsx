import { useRouter } from "next/router";
import BookModal from "./BookModal";

type Props = {};

export default function CPModal({}: Props) {
  const router = useRouter();
  const { query } = router;
  if (
    typeof query.collectionId !== "string" &&
    typeof query.articleId !== "boolean"
  )
    return null;

  return (
    <div
      className="
      absolute flex items-center justify-center
      w-full h-full z-30 bg-neutral-900/70 overflow-hidden"
    >
      <BookModal />
    </div>
  );
}
