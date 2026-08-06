import { useEffect, useState, type MouseEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mountain, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

// href = section anchor on the homepage; route = real page to navigate to (optional)
const navLinks = [
  { label: 'Home', href: '#home', route: '/' },
  { label: 'Destinations', href: '#destination', route: '/destination' },
  { label: 'Recommendations', href: '#recommendations', route: '/recommendations' },
  { label: 'Itinerary', href: '#itinerary', route: '/itinerary' },
  { label: 'About', href: '#about' },
]
export function SiteNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function handleNavClick(e: MouseEvent<HTMLAnchorElement>, link: typeof navLinks[number]) {
    if (link.route) {
      e.preventDefault()
      navigate(link.route)
      setOpen(false)
    }
    // else: let the default anchor behavior handle same-page scroll
  }

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-border bg-background/85 backdrop-blur-md shadow-sm'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors">
            <Mountain className="size-6" strokeWidth={2.2} />
          </span>
          <span
            className={cn(
              'text-2xl font-bold transition-colors',
              scrolled ? 'text-foreground' : 'text-white',
            )}
          >
            Sajilo Yatra
          </span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => handleNavClick(e, link)}
                className={cn(
                  'rounded-full px-5 py-2 text-lg font-semibold transition-colors',
                  scrolled
                    ? 'text-muted-foreground hover:bg-accent hover:text-primary'
                    : 'text-white/90 hover:bg-white/15 hover:text-white',
                )}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 md:flex">
          <Button
            variant="ghost"
            onClick={() => navigate('/login')}
            className={cn(
              'rounded-full text-lg font-semibold',
              scrolled
                ? 'text-foreground hover:bg-accent hover:text-primary'
                : 'text-white hover:bg-white/15 hover:text-white',
            )}
          >
            Login
          </Button>
          <Button className="h-10 rounded-full px-5 text-lg font-bold" onClick={() => navigate('/register')}>
            Register
          </Button>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className={cn(
            'flex size-10 items-center justify-center rounded-lg md:hidden',
            scrolled ? 'text-foreground' : 'text-white',
          )}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-border bg-background px-5 py-4 md:hidden">
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => handleNavClick(e, link)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-primary"
              >
                {link.label}
              </a>
            </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-col gap-2">
            <Button variant="outline" className="w-full rounded-full" onClick={() => { navigate('/login'); setOpen(false) }}>
              Login
            </Button>
            <Button className="w-full rounded-full" onClick={() => { navigate('/register'); setOpen(false) }}>
              Register
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}