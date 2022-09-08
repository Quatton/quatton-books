type Props = {
  isNextAvailable: boolean;
  isPrevAvailable: boolean;
  next: () => void;
  prev: () => void;
};

export default function ModalMenu({
  isNextAvailable,
  isPrevAvailable,
  next,
  prev,
}: Props) {
  return (
    <>
      <span
        className={`bg-camel px-4 py-2 
    rounded-l-md text-2xl z-60
    ${
      !isPrevAvailable
        ? "cursor-not-allowed bg-gray-500 text-gray-700"
        : "hover:bg-amber-200 hover:text-amber-900"
    }`}
        onClick={() => prev()}
      >
        Prev
      </span>
      <span
        className={`bg-camel px-4 py-2 
    rounded-r-md text-2xl
    ${
      !isNextAvailable
        ? "cursor-not-allowed bg-gray-500 text-gray-700"
        : "hover:bg-amber-200 hover:text-amber-900"
    }`}
        onClick={() => next()}
      >
        Next
      </span>
    </>
  );
}
