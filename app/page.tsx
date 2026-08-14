import Link from "next/link";

const Home = () => {
  return (
    <main className="mx-auto flex max-w-page flex-1 flex-col justify-center px-8 py-24">
      <h1 className="text-display text-ink">SAT Portal</h1>
      <p className="mt-3 text-lead">
        Design system installed.{" "}
        <Link href="/design-system">Review the UI kit</Link>.
      </p>
    </main>
  );
};

export default Home;
