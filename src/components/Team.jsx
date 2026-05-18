import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionHeader from './SectionHeader.jsx'
import { members, studentGroups } from '../data/members.js'

export default function Team() {
  const [active, setActive] = useState(studentGroups[0].id)

  const filtered = useMemo(() => {
    return members.filter((m) => m.degree === active)
  }, [active])

  const counts = useMemo(() => {
    const c = {}
    for (const m of members) c[m.degree] = (c[m.degree] || 0) + 1
    return c
  }, [])

  return (
    <section id="team" className="relative bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-[1320px] px-6 md:px-10">
        <SectionHeader
          index={2}
          kicker="研究团队 · 在岗成员"
          title="内部成员"
        />

        {/* Degree tabs — doctoral / master / undergraduate */}
        <div className="mb-10 flex flex-wrap gap-x-1 gap-y-2 border-y border-ink/10 py-4">
          {studentGroups.map((group) => {
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

        {/* Member grid */}
        <motion.ul
          layout
          className="grid grid-cols-1 gap-px border border-ink/15 bg-ink/15 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((m, i) => (
              <motion.li
                key={`${m.name}-${m.degree}-${m.research}`}
                layout
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="group relative flex min-h-[260px] flex-col bg-paper p-6 transition-colors hover:bg-surface"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="capsule">M-{String(i + 1).padStart(2, '0')}</span>
                  <span className="capsule text-cyan_med">{m.degreeLabel}</span>
                </div>

                <div className="mt-6 flex items-baseline gap-3">
                  <span className="display text-3xl text-ink">{m.name}</span>
                  {m.institutionCode && (
                    <span className="capsule uppercase text-cyan_med">
                      {m.institutionCode}
                    </span>
                  )}
                </div>

                <div className="mt-4 text-[15px] leading-relaxed text-ink/80">
                  {m.research}
                </div>

                <div className="mt-5 space-y-1 border-t border-ink/10 pt-4">
                  <div className="capsule">年级 · {m.grade || '未标注'}</div>
                  <div className="capsule">院校 · {m.institution}</div>
                  {m.college && <div className="capsule">学院 · {m.college}</div>}
                </div>

                <span
                  className="signal-dot absolute bottom-5 right-5 opacity-0 transition-opacity group-hover:opacity-100"
                  aria-hidden
                />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        <div className="mt-6 capsule">
          已显示 {filtered.length} / {members.length} 位成员
        </div>
      </div>
    </section>
  )
}
