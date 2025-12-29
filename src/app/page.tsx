import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href="#">
          <span className="font-bold text-xl">PlanFlow</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/login">
            Login
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/pricing">
            Pricing
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative overflow-hidden">
          {/* Abstract Background Elements */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          </div>

          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-7xl/none bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-500 dark:from-white dark:to-gray-400">
                  Lesson Planning, <br className="hidden sm:inline" />
                  <span className="text-primary">Reimagined.</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Generate comprehensive lesson plans in seconds with AI. Drag, drop, and teach.
                </p>
              </div>
              <div className="space-x-4 pt-4">
                <Link href="/login">
                  <Button size="lg" className="rounded-full px-8 h-12 text-base shadow-lg hover:shadow-primary/25 transition-all">Get Started</Button>
                </Link>
                <Link href="#features">
                  <Button variant="outline" size="lg" className="rounded-full px-8 h-12 text-base backdrop-blur-sm bg-white/50 dark:bg-black/50">Learn More</Button>
                </Link>
              </div>

              {/* Hero Image */}
              <div className="w-full max-w-5xl mt-16 rounded-xl border bg-gray-50/50 p-2 shadow-2xl backdrop-blur-sm dark:bg-gray-900/50 md:p-4 perspective-[2000px]">
                <div className="relative aspect-video overflow-hidden rounded-md border shadow-sm">
                  <Image
                    src="/hero-dark.png"
                    alt="PlanFlow AI Lesson Planner Dashboard"
                    fill
                    className="object-cover transition-transform hover:scale-105 duration-700"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 PlanFlow. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}

