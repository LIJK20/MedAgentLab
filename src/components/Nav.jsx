import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const LINKS = [
  { id: 'overview', label: '总体概况' },
  { id: 'team', label: '研究团队' },
  { id: 'research', label: '研究成果' },
  { id: 'contact', label: '联系我们' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-40 transition-[backdrop-filter,background,border-color] duration-300 ${
        scrolled
          ? 'backdrop-blur-md bg-paper/80 border-b border-ink/10'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-[1320px] items-center justify-between px-6 py-4 md:px-10">
        <Link to="/home#hero" className="flex items-center gap-3">
          <span className="signal-dot" aria-hidden />
          <span className="font-mono text-xs tracking-wider2 uppercase text-ink">
            MedAgentLab
          </span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <li key={link.id}>
              <Link
                to={`/home#${link.id}`}
                className="font-sans text-sm text-mute transition-colors hover:text-ink"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          to="/home#contact"
          className="font-sans text-sm text-ink underline-offset-4 hover:underline"
        >
          加入我们 →
        </Link>
      </div>
    </nav>
  )
}
