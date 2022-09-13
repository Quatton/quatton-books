import Layout from "@/components/Layout";

export default function NotFound() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-full w-full gap-4 text-amber-900">
        <h1 className="text-8xl">404</h1>
        <h2 className="text-2xl text-center border-amber-700">
          I am not sure if I have the page you're looking for.
        </h2>
        <h2 className="text-xl text-center border-amber-700">
          (or at least in the language you are currently selecting...)
        </h2>
      </div>
    </Layout>
  );
}
