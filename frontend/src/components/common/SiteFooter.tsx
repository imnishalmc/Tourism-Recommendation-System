import { Mountain, Globe, MessageCircle, Send, Mail } from 'lucide-react'

const columns = [
  {
    title: 'Explore',
    links: ['Destinations', 'Districts', 'Activities', 'Trekking Routes'],
  },
  {
    title: 'Recommendations',
    links: ['AI Matches', 'Popular Trips', 'Seasonal Picks', 'Hidden Gems'],
  },
  {
    title: 'Company',
    links: ['About', 'Privacy', 'Contact', 'Careers'],
  },
]

const socials = [
  { icon: Globe, label: 'Website' },
  { icon: MessageCircle, label: 'Community' },
  { icon: Send, label: 'Telegram' },
  { icon: Mail, label: 'Email' },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <a href="#home" className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Mountain className="size-5" strokeWidth={2.2} />
              </span>
              <span className="text-lg font-bold tracking-tight">
                Sajilo Yatra
              </span>
            </a>
            <p className="mt-4 max-w-xs text-pretty leading-relaxed text-muted-foreground">
              AI-powered travel recommendations and smart itineraries to help
              you discover Nepal, smarter.
            </p>
            <div className="mt-6 flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="flex size-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:bg-light-blue hover:text-primary"
                >
                  <s.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold">{col.title}</h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link}
                    </a>
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
