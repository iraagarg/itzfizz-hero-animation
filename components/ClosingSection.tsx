const GITHUB_PROFILE = "https://github.com/iraagarg";
const REPO_URL = "https://github.com/iraagarg/itzfizz-hero-animation";

export default function ClosingSection() {
  return (
    <section className="bg-night text-white">
      <div className="mx-auto flex min-h-[70svh] max-w-5xl flex-col justify-center px-6 py-24">
        <p className="text-sm tracking-[0.3em] text-trail uppercase">Finish line</p>
        <h2 className="mt-4 text-4xl font-bold sm:text-6xl">Websites that move people.</h2>
        <p className="mt-6 max-w-xl text-lg text-white/70">
          This hero was built for Itzfizz Digital with Next.js, GSAP ScrollTrigger, Lenis and
          Tailwind CSS. Scroll back up to take it for another drive.
        </p>
      </div>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-6 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Built by <span className="text-white">Iraa Garg</span>
          </p>
          <nav aria-label="Project links" className="flex gap-6">
            <a href={GITHUB_PROFILE} className="transition-colors hover:text-trail" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href={REPO_URL} className="transition-colors hover:text-trail" target="_blank" rel="noopener noreferrer">
              Source code
            </a>
          </nav>
        </div>
      </footer>
    </section>
  );
}
