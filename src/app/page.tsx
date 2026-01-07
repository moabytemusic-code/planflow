import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Zap, Calendar, Sparkles, BrainCircuit, ArrowRight, Star } from "lucide-react";
import { NewsletterForm } from "@/components/newsletter-form";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      {/* Navigation */}
      <header className="px-6 lg:px-12 h-16 flex items-center border-b bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <Link className="flex items-center justify-center gap-2" href="#">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">PlanFlow</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-medium hover:text-indigo-600 transition-colors" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:text-indigo-600 transition-colors" href="/pricing">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:text-indigo-600 transition-colors" href="/login">
            Login
          </Link>
          <Link href="/login">
            <Button size="sm" className="hidden sm:flex bg-indigo-600 hover:bg-indigo-700 text-white rounded-full">
              Get Started
            </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="w-full py-20 md:py-32 relative overflow-hidden">
          {/* Background Gradients */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4"></div>
          </div>

          <div className="container px-4 md:px-6 relative z-10 mx-auto text-center">
            <div className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm text-indigo-800 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300 mb-6">
              <span className="flex h-2 w-2 rounded-full bg-indigo-600 mr-2 animate-pulse"></span>
              New: Viral Hook Generator
            </div>

            <h1 className="mx-auto max-w-4xl text-5xl md:text-7xl font-extrabold tracking-tight dark:text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 leading-tight">
              Stop Spending Your <br /> <span className="text-indigo-600">Weekends Planning.</span>
            </h1>

            <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Generate comprehensive, standards-aligned lesson plans in seconds.
              Drag, drop, and get back to what you love—teaching.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/login">
                <Button size="lg" className="rounded-full px-8 h-12 text-base shadow-xl bg-indigo-600 hover:bg-indigo-700 hover:scale-105 transition-all duration-300">
                  Try for Free
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="#demo">
                <Button variant="outline" size="lg" className="rounded-full px-8 h-12 text-base border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">
                  View Demo
                </Button>
              </Link>
            </div>

            {/* Dashboard Preview */}
            <div className="mt-16 relative mx-auto max-w-5xl rounded-xl border bg-white/50 p-2 shadow-2xl backdrop-blur-sm dark:bg-slate-900/50 ring-1 ring-slate-200 dark:ring-slate-800">
              <div className="aspect-video relative rounded-lg overflow-hidden bg-slate-950">
                <Image
                  src="/hero-dark.png"
                  alt="PlanFlow Dashboard"
                  fill
                  className="object-cover opacity-90"
                />
                {/* Floating Badge */}
                <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur px-4 py-2 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 flex items-center gap-3 animate-bounce">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold">Biology Lesson</p>
                    <p className="text-[10px] text-slate-500">Generated in 4.2s</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LOGO CLOUD (Social Proof) */}
        <section className="py-12 border-y bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-6">Trusted by innovative teachers from</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              {/* Placeholders for logos */}
              <div className="flex items-center gap-2 text-xl font-bold font-serif">🏫 Public Schools</div>
              <div className="flex items-center gap-2 text-xl font-bold font-mono">🎓 Charter Networks</div>
              <div className="flex items-center gap-2 text-xl font-bold font-sans">🏡 Homeschool Co-ops</div>
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section id="features" className="py-24 bg-slate-50 dark:bg-slate-950">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Everything you need to <br /> dominate the school week.</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">PlanFlow replaces your messy docs, planners, and sticky notes with one intelligent system.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border hover:shadow-xl hover:-translate-y-1 transition-all">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">AI Lesson Generation</h3>
                <p className="text-slate-500 leading-relaxed">
                  Input a topic like &quot;Photosynthesis for 5th grade&quot; and get a full lesson plan, vocabulary, and activities in under 10 seconds.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border hover:shadow-xl hover:-translate-y-1 transition-all">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600 mb-6">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Visual Weekly Planner</h3>
                <p className="text-slate-500 leading-relaxed">
                  A drag-and-drop calendar that feels like magic. Move lessons around, duplicate days, and see your whole week at a glance.
                </p>
              </div>

              {/* Feature 3 (New) */}
              <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border hover:shadow-xl hover:-translate-y-1 transition-all relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-lg">NEW</div>
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Viral Hook Forge</h3>
                <p className="text-slate-500 leading-relaxed">
                  Students bored? Use our &quot;Viral Hook&quot; tool to generate engaging lesson openers based on current trends and memes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* COMPARISON / PAIN POINT SECTION */}
        <section className="py-24 bg-indigo-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold mb-6">The old way is broken.</h2>
                <ul className="space-y-6">
                  <li className="flex items-center gap-4 text-indigo-200">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 font-bold">✕</div>
                    <span className="text-lg">Spending Sunday nights writing docs</span>
                  </li>
                  <li className="flex items-center gap-4 text-indigo-200">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 font-bold">✕</div>
                    <span className="text-lg">Searching Google for hours for worksheets</span>
                  </li>
                  <li className="flex items-center gap-4 text-indigo-200">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 font-bold">✕</div>
                    <span className="text-lg">Students zoning out during lectures</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
                <h3 className="text-2xl font-bold mb-6">With PlanFlow:</h3>
                <ul className="space-y-4">
                  <li className="flex items-center gap-4">
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                    <span className="text-lg font-medium">Leave school at 3:30 PM</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                    <span className="text-lg font-medium">Instant engagement with viral hooks</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                    <span className="text-lg font-medium">Aligned to State Standards automatically</span>
                  </li>
                </ul>
                <Link href="/login">
                  <Button className="w-full mt-8 bg-green-500 hover:bg-green-600 text-white font-bold h-12 text-lg">
                    Start My Free Trial
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-24 bg-slate-50 dark:bg-slate-950">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-16">Teachers love PlanFlow</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border text-left">
                  <div className="flex gap-1 text-yellow-400 mb-4">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mb-6 italic">&quot;This tool literally saved my sanity. I used to spend 4 hours on Sundays planning. Now I do it in 15 minutes.&quot;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                    <div>
                      <p className="font-bold text-sm">Sarah J.</p>
                      <p className="text-xs text-slate-500">5th Grade Teacher</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 container mx-auto px-4">
          <div className="bg-indigo-600 rounded-3xl p-12 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
            <div className="relative z-10 max-w-2xl mx-auto space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold">Ready to reclaim your time?</h2>
              <p className="text-indigo-100 text-lg">Join the waitlist of teachers who are automating their busywork.</p>
              <Link href="/login">
                <Button size="lg" className="bg-white text-indigo-700 hover:bg-indigo-50 font-bold px-12 h-14 text-lg rounded-full shadow-2xl">
                  Get Started for Free
                </Button>
              </Link>
              <p className="text-sm text-indigo-200 opacity-80">No credit card required for free tier.</p>
            </section>

            {/* NEWSLETTER */}
            <section className="py-24 bg-slate-50 dark:bg-slate-950 border-t">
              <div className="container mx-auto px-4">
                <NewsletterForm />
              </div>
            </section>
          </main>

          <footer className="py-12 border-t bg-slate-900 text-slate-400">
            <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <span className="font-bold text-xl text-white">PlanFlow</span>
                <p className="text-sm">Empowering educators with AI tools that give them their weekends back.</p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-4">Product</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="#features" className="hover:text-white">Features</Link></li>
                  <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
                  <li><Link href="#" className="hover:text-white">Changelog</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-white mb-4">Legal</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
                  <li><Link href="#" className="hover:text-white">Terms of Service</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-white mb-4">Contact</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="#" className="hover:text-white">Twitter</Link></li>
                  <li><Link href="#" className="hover:text-white">Email Us</Link></li>
                </ul>
              </div>
            </div>
          </footer>
        </div >
        );
}

