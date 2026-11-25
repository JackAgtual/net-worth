import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSession } from "@/lib/auth/auth-utils";
import {
  Calculator,
  CalendarCheck,
  LineChart,
  ListChecks,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getSession();

  if (session) {
    redirect("/dashboard");
  }

  const STEPS = [
    {
      icon: CalendarCheck,
      title: "Create a statement for the year",
      body: "Enter your assets and liabilities for the year.",
    },
    {
      icon: Calculator,
      title: "Metrics are calculated",
      body: "Your net worth and the other key metrics are worked out automatically.",
    },
    {
      icon: LineChart,
      title: "Track your progress",
      body: "Compare years to see what changed and look into any single year in detail.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2 font-bold tracking-tight">
            <span className="grid size-7 place-items-center rounded-lg bg-primary text-primary-foreground">
              <TrendingUp className="size-4" />
            </span>
            Net Worth Tracker
          </div>
          <nav className="flex items-center gap-2">
            <Button asChild variant="ghost" className="hidden sm:inline-flex">
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link href="/create-account">Create account</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-14 px-6 py-16 md:grid-cols-2 md:py-24">
          <div>
            <h1 className="mb-5 text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl">
              Watch your net worth grow, one year at a time.
            </h1>
            <p className="mb-8 max-w-md text-lg text-muted-foreground">
              Enter your assets and liabilities once a year. Net Worth Tracker
              does the math and shows how your finances have changed.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/create-account">Create account</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/login">Log in</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Already have an account? Log in to see your latest numbers.
            </p>
          </div>
        </section>

        <section className="border-t">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <h2 className="mb-3 max-w-xl text-3xl font-bold tracking-tight sm:text-4xl">
              One annual check-in is all it takes
            </h2>
            <p className="mb-10 max-w-xl text-muted-foreground">
              Built for a yearly habit, not daily logging. Sit down once, fill
              in the numbers, and you’re done.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              {STEPS.map(({ icon: Icon, title, body }, n) => (
                <Card key={title}>
                  <CardHeader>
                    <div className="mb-2 flex items-center gap-3">
                      <span className="grid size-8 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                        {n + 1}
                      </span>
                      <Icon className="size-5 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-lg">{title}</CardTitle>
                    <CardDescription className="text-base">
                      {body}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <div className="grid gap-8 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <LineChart className="mb-2 size-6 text-primary" />
                  <CardTitle>See how your finances change over time</CardTitle>
                  <CardDescription className="text-base">
                    Trends make progress visible. Track your key metrics across
                    years and spot the good years, the flat ones, and what moved
                    the needle.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <ListChecks className="mb-2 size-6 text-primary" />
                  <CardTitle>Open any year for a full breakdown</CardTitle>
                  <CardDescription className="text-base">
                    Pick a year to see exactly what you owned and owed, and how
                    each piece adds up to your net worth.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-7 text-sm text-muted-foreground">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-3 px-6">
          <span>© {new Date().getFullYear()} Net Worth Tracker</span>
        </div>
      </footer>
    </div>
  );
}
