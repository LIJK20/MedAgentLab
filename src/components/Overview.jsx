import { useMemo, useState } from 'react'
import SectionHeader from './SectionHeader.jsx'
import DirectorCard from './DirectorCard.jsx'
import { directorGroups, directors } from '../data/directors.js'
import { tracks } from '../data/tracks.js'
import { Link } from 'react-router-dom'

export default function Overview() {
  const [active, setActive] = useState(directorGroups[0].id)

  const filteredDirectors = useMemo(() => {
    return directors.filter((d) => d.group === active)
  }, [active])

  const counts = useMemo(() => {
    const c = {}
    for (const d of directors) c[d.group] = (c[d.group] || 0) + 1
    return c
  }, [])

  return (
    <section id="overview" className="relative bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-[1320px] px-6 md:px-10">
        <SectionHeader
          index={1}
          kicker="总体概况 · 导师阵容与研究方向"
          title="导师团队"
        />

        <div className="mb-10 flex flex-wrap gap-x-1 gap-y-2 border-y border-ink/10 py-4">
          {directorGroups.map((group) => {
            const isActive = active === group.id
            return (
              <button
                key={group.id}
                onClick={() => setActive(group.id)}
                className={`group relative flex items-baseline gap-2 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider2 transition-colors ${
                  isActive
                    ? 'bg-ink text-paper'
                    : 'text-mute hover:text-ink'
                }`}
              >
                <span>{group.name}</span>
                <span className={isActive ? 'text-paper/60' : 'text-ink/30'}>
                  ({counts[group.id] || 0})
                </span>
              </button>
            )
          })}
        </div>

        {/* 导师卡片 */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 md:gap-8">
          {filteredDirectors.map((d, i) => (
            <DirectorCard key={d.id} d={d} index={i} />
          ))}
        </div>

        {/* 研究方向 —— 学术目录式排版 */}
        <div className="mt-24 border-t border-ink">
          <div className="grid grid-cols-12 border-b border-ink/15 py-3 capsule uppercase">
            <div className="col-span-2 md:col-span-1">编号</div>
            <div className="col-span-10 md:col-span-6">研究方向</div>
            <div className="col-span-8 mt-2 md:col-span-3 md:mt-0">关键词</div>
            <div className="col-span-4 mt-2 text-right md:col-span-2 md:mt-0">详情</div>
          </div>
          {tracks.map((t) => (
            <div
              key={t.code}
              className="group grid grid-cols-12 items-baseline gap-y-1 border-b border-ink/10 py-6 transition-colors hover:bg-ink/[0.02]"
            >
              <div className="col-span-2 md:col-span-1 capsule text-ink">{t.code}</div>
              <div className="col-span-10 md:col-span-6">
                <div className="display text-2xl text-ink md:text-3xl">{t.title}</div>
                <div className="mt-1 font-mono text-xs uppercase tracking-wider2 text-mute">
                  {t.en}
                </div>
              </div>
              <div className="col-span-8 md:col-span-3 capsule">{t.note}</div>
              <div className="col-span-4 flex justify-end md:col-span-2">
                <Link
                  to={`/home/tracks/${t.slug}`}
                  className="inline-flex items-center border border-ink/25 px-3 py-2 font-mono text-[11px] uppercase tracking-wider2 text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper"
                >
                  查看详情 ↗
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
