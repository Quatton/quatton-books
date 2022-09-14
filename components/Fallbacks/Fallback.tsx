import Layout from "../Layout";

export default function Fallback() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-full w-full gap-4 text-amber-900">
        <h2 className="text-xl sm:text-2xl text-center border-amber-700">
          what
        </h2>
        <h2 className="text-lg sm:text-xl text-center border-amber-700">
          Wait a sec. I didn't expect you to see this.
        </h2>
      </div>
    </Layout>
  );
}
