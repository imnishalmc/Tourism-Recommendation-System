

import { Link } from "react-router-dom";
import { Mountain } from "lucide-react";
const columns = [
  {
    title: "Home",
    links: [{ label: "Home", to: "/" }]
  },
  {
    title: "Explore",
    links: [{ label: "Destinations", to: "/destination" }]
  },
  {
    title: "Itinerary",
    links: [{ label: "AI Matches", to: "/itinerary" }]
  }
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/sajiloyatralogo.png"
                alt="Sajilo Yatra logo"
                className="size-37 object-contain"
              />

            </Link>
            <p className="mt-[-29px] max-w-xs text-pretty leading-relaxed text-muted-foreground">
              AI-powered travel recommendations and smart itineraries to help
              you discover Nepal, smarter.
            </p>

          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold">{col.title}</h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} Sajilo Yatra. All rights reserved.</p>
          <p>Made with care for travelers in Nepal.</p>
        </div>
      </div>
    </footer>
  )
}
