"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Cpu, Wrench, GraduationCap } from "lucide-react";
import { BackgroundGrid } from "@/components/ui/background-grid";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 lg:py-40 overflow-hidden">
        <BackgroundGrid />
        <div className="container mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full border border-primary/20 bg-secondary/50 px-3 py-1 text-sm font-medium backdrop-blur-sm mb-6"
          >
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            Arkansas&apos;s First Community Tech Hub
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-6 !text-black dark:!text-transparent dark:bg-clip-text dark:bg-gradient-to-b dark:from-white dark:to-white/70"
          >
            Learn. <span className="text-primary">Build.</span> Collaborate.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-[600px] mb-10 leading-relaxed"
          >
            A place where people of all ages can explore technology, build projects, and gain real-world skills. Join the movement.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Link href="/education" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base shadow-lg shadow-primary/20 transition-transform hover:scale-105">
                Explore Workshops
              </Button>
            </Link>
            <Link href="/contact" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 text-base backdrop-blur-sm bg-background/50 hover:bg-accent/50">
                Visit Us
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Services / Pillars */}
      <section className="py-24 bg-muted/30 relative">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px] pointer-events-none" />
        <div className="container mx-auto px-6 md:px-12 relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">What We Offer</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Everything you need to innovate under one roof. We combine education, retail, and repair services.</p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: GraduationCap,
                title: "Tech Education",
                desc: "Hands-on learning for all ages. Coding, robotics, and more.",
                items: ["Coding Workshops", "Robotics & Drones", "Electronics Basics"],
                link: "/education",
                label: "Learn More"
              },
              {
                icon: Cpu,
                title: "Retail Access",
                desc: "Local source for maker components and kits.",
                items: ["Raspberry Pi & Arduino", "Sensors & Modules", "3D Printer Supplies"],
                link: "/retail",
                label: "Browse Shop"
              },
              {
                icon: Wrench,
                title: "Repairs & Help",
                desc: "Expert repairs and guided 'Learn-to-Fix' sessions.",
                items: ["Guided \"Learn-to-Fix\"", "Computer Repair", "Electronic Diagnostics"],
                link: "/repairs",
                label: "Get Support"
              }
            ].map((service, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full bg-card/40 backdrop-blur-md border border-white/10 dark:border-white/10 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 group">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <service.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <CardDescription className="text-base">{service.desc}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col h-full gap-6">
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      {service.items.map((item, i) => (
                        <li key={i} className="flex items-center">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary/50 mr-2" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Link href={service.link}>
                      <Button variant="ghost" className="p-0 h-auto font-medium text-primary hover:text-primary/80 hover:bg-transparent group-hover:translate-x-1 transition-transform">
                        {service.label} <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Vision / Mission */}
      <section className="py-24 md:py-32 overflow-hidden">
        <div className="container mx-auto px-6 md:px-12 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="grid lg:grid-cols-2 gap-16 items-center"
          >
            <div className="space-y-6">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-medium">
                Our Vision
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
                One Space. <br /> Infinite Possibilities.
              </h2>
              <blockquote className="border-l-4 border-primary pl-6 py-2 italic text-muted-foreground text-lg">
                "MakerSpace is about more than technology — it’s about giving people a place to connect, learn, and build something real together."
              </blockquote>

              <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
                <p>
                  Our mission is to make technology approachable, practical, and inspiring for Arkansans.
                </p>
                <p>
                  Whether you're a student building your first robot, a hobbyist looking for parts, or an entrepreneur prototyping a product, we are here to support your journey.
                </p>
              </div>

              <div className="pt-4">
                <Link href="/about">
                  <Button size="lg" variant="secondary" className="h-12 px-8">Read Our Story</Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-2xl blur-3xl -z-10 transform rotate-3" />
              <div className="rounded-2xl overflow-hidden border bg-card/50 aspect-video shadow-2xl flex items-center justify-center relative group">
                <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors duration-500" />
                {/* Abstract Grid Graphic */}
                <div className="grid grid-cols-6 gap-2 opacity-20 transform -rotate-12 scale-150">
                  {[...Array(24)].map((_, i) => (
                    <div key={i} className="h-12 w-12 rounded-lg bg-current" />
                  ))}
                </div>
                <div className="relative z-10 text-center p-6">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Community Hub</p>
                  <p className="text-2xl font-bold">Central Arkansas</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
