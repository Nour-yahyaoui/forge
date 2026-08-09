// app/about/page.tsx
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto py-6 md:py-8">
        <Navbar activePage="about" />

        <section className="py-12 md:py-16 border-b-2 border-gray-200">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-500 border-b border-gray-300 pb-1 inline-block">
              About CodeForge
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mt-4">
              Built by a developer, <br />
              <span className="text-red-600">for students.</span>
            </h1>
            <p className="text-lg text-gray-600 mt-4 max-w-lg">
              CodeForge was created to bridge the gap between academic knowledge and real‑world engineering — by someone who's been where you are.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16 border-b-2 border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold tracking-tight mb-4">
                My name is <span className="text-red-600">Nour Yahyaoui</span>
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  I'm a <strong>19‑year‑old full‑stack developer</strong> from Tunisia with over <strong>4 years of experience</strong> and <strong>40+ projects</strong> shipped — ranging from frontend websites to enterprise‑level POS systems and mobile applications.
                </p>
                <p>
                  I started CodeForge because I've seen too many students graduate with degrees but without the <strong>practical skills</strong> needed to build real software. University taught me theory. Building real projects taught me engineering.
                </p>
                <p>
                  This platform is my way of giving back — a free, project‑based learning environment where students build <strong>real applications</strong>, get <strong>honest code reviews</strong>, and learn to think like engineers, not just coders.
                </p>
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-200 p-6 h-fit">
              <div className="mb-4 border-2 border-gray-200 overflow-hidden">
                <Image src="/port.png" alt="Nour Yahyaoui" width={400} height={400} className="w-full h-auto object-cover" priority />
              </div>
              <div className="text-xl font-bold">Nour Yahyaoui</div>
              <div className="text-sm text-gray-500">Full‑Stack Developer · Mentor</div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}