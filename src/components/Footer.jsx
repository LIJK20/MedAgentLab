import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-ink/15 bg-paper">
      <div className="mx-auto max-w-[1320px] px-6 py-12 md:px-10 md:py-16">
        <div className="grid grid-cols-12 gap-y-10 gap-x-6 md:gap-x-10">
          <div className="col-span-12 md:col-span-5">
            <div className="flex items-center gap-3">
              <span className="signal-dot" aria-hidden />
              <span className="font-mono text-xs uppercase tracking-wider2 text-ink">
                MedAgentLab
              </span>
            </div>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-mute">
              医疗人工智能与智能体实验室 · 兰州大学信息科学与工程学院 ·
              Medical Artificial Intelligence & Agent Laboratory.
            </p>
          </div>

          <FooterCol title="导航">
            <FooterLink href="#overview">总体概况</FooterLink>
            <FooterLink href="#team">研究团队</FooterLink>
            <FooterLink href="#research">研究成果</FooterLink>
            <FooterLink href="#contact">联系我们</FooterLink>
          </FooterCol>

          <FooterCol title="所属机构">
            <li className="text-sm text-ink/85">兰州大学 · 信息科学与工程学院</li>
            <li className="text-sm text-mute">榆中校区 · 致远楼 421</li>
            <li className="text-sm text-mute">730107 · 甘肃 · 中国</li>
          </FooterCol>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-ink/10 pt-6 md:flex-row md:items-center" />
      </div>
    </footer>
  )
}

function FooterCol({ title, children }) {
  return (
    <div className="col-span-6 md:col-span-2">
      <div className="capsule mb-4 uppercase">{title}</div>
      <ul className="space-y-2">{children}</ul>
    </div>
  )
}

function FooterLink({ href, children }) {
  return (
    <li>
      <Link
        to={href.startsWith('#') ? `/home${href}` : href}
        className="text-sm text-ink/85 underline-offset-4 transition-colors hover:text-ink hover:underline"
      >
        {children}
      </Link>
    </li>
  )
}
