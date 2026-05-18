import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionHeader from './SectionHeader.jsx'
import { publications, awards } from '../data/research.js'

const TABS = [
  { id: 'pubs', label: '论文发表', sub: 'Publications' },
  { id: 'awards', label: '竞赛获奖', sub: 'Awards' },
]

const CN_FONT_STACK = '"Microsoft YaHei", SimSun, sans-serif'
const META_CLASS = 'text-[11px] tracking-[0.04em] text-mute'
const META_DARK_CLASS = 'text-[11px] tracking-[0.04em] text-ink'

// Localize publication status tag for display while keeping the underlying
// data field in canonical English (so it remains greppable in research.js).
const TAG_LABEL = {
  Accepted: '已接收',
  Published: '已发表',
  Preprint: '预印本',
  'In Submission': '投稿中',
  'Under Review': '审稿中',
  Mock: '示例',
}

function PubRow({ p, index }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 0.6, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      className="group grid grid-cols-12 items-baseline gap-y-2 border-b border-ink/10 py-7 transition-colors hover:bg-ink/[0.02]"
    >
      <div className={`col-span-12 md:col-span-1 ${META_CLASS}`}>
        [{String(index + 1).padStart(2, '0')}]
      </div>

      <div className="col-span-12 md:col-span-7">
        <h3 className="text-xl font-normal text-ink md:text-2xl">{p.title}</h3>
        <div className="mt-2 text-sm text-ink/75">
          {p.authors.join(', ')}
        </div>
        {p.note && (
          <div className="mt-2 text-xs leading-relaxed text-ink/55">
            {p.note}
          </div>
        )}
      </div>

      <div className="col-span-6 md:col-span-2">
        <div className={META_DARK_CLASS}>{p.venue}</div>
        <div className={`mt-1 ${META_CLASS}`}>年份 · {p.year}</div>
      </div>

      <div className="col-span-6 md:col-span-2 flex items-center justify-end gap-3">
        <span
          className={`border px-2.5 py-1 text-[10px] tracking-[0.04em] ${
            p.tag === 'Accepted'
              ? 'border-cyan_med text-cyan_med'
              : p.tag === 'In Submission'
              ? 'border-ink text-ink'
              : 'border-ink/30 text-mute'
          }`}
        >
          {TAG_LABEL[p.tag] || p.tag}
        </span>
        {p.doi && (
          <a
            href={`https://doi.org/${p.doi}`}
            target="_blank"
            rel="noreferrer noopener"
            className={`${META_CLASS} underline-offset-4 hover:underline`}
          >
            DOI ↗
          </a>
        )}
      </div>
    </motion.li>
  )
}

function AwardRow({ a, index }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group grid grid-cols-12 items-start gap-x-6 gap-y-5 border-b border-ink/10 py-7 transition-colors hover:bg-ink/[0.02]"
    >
      <div className={`col-span-12 md:col-span-1 ${META_CLASS}`}>
        [{String(index + 1).padStart(2, '0')}]
      </div>
      <div className="col-span-12 md:col-span-5">
        <h3 className="text-xl font-normal text-ink md:text-2xl">{a.title}</h3>
        <div className={`mt-2 ${META_CLASS}`}>主办方 · {a.org}</div>
      </div>
      <div className={`col-span-6 md:col-span-2 ${META_DARK_CLASS}`}>
        {a.year}
      </div>
      <div className="col-span-6 flex items-start justify-end md:col-span-1">
        <span className="border border-cyan_med px-2.5 py-1 text-[10px] tracking-[0.04em] text-cyan_med">
          {a.placement}
        </span>
      </div>
      <div className="col-span-12 md:col-span-3">
        {a.certificate && (
          <a
            href={a.certificate}
            target="_blank"
            rel="noreferrer noopener"
            className="group/cert block border border-ink/15 bg-white p-2 transition-colors hover:border-ink"
          >
            <img
              src={a.certificate}
              alt={`${a.title}获奖证书`}
              loading="lazy"
              className="h-36 w-full object-contain grayscale-[18%] transition duration-500 group-hover/cert:grayscale-0 md:h-44"
            />
            <span className="mt-2 block text-right text-[10px] tracking-[0.04em] text-mute">
              查看证书 ↗
            </span>
          </a>
        )}
      </div>
    </motion.li>
  )
}

export default function Research() {
  const [tab, setTab] = useState('pubs')

  return (
    <section
      id="research"
      className="relative bg-paper py-24 md:py-32"
      style={{ fontFamily: CN_FONT_STACK }}
    >
      <div className="mx-auto max-w-[1320px] px-6 md:px-10">
        <SectionHeader
          index={3}
          kicker="研究成果 · 论文与获奖"
          title="学术成果展示"
        />

        {/* Tab control */}
        <div className="mb-10 flex flex-wrap items-center gap-6 border-y border-ink/10 py-4">
          {TABS.map((t) => {
            const isActive = tab === t.id
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="group relative flex items-baseline gap-2"
              >
                <span
                  className={`text-2xl font-normal md:text-3xl transition-colors ${
                    isActive ? 'text-ink' : 'text-ink/35 group-hover:text-ink/60'
                  }`}
                >
                  {t.label}
                </span>
                <span className={META_CLASS}>{t.sub}</span>
                {isActive && (
                  <motion.span
                    layoutId="research-underline"
                    className="absolute -bottom-[18px] left-0 right-0 h-px bg-ink"
                  />
                )}
              </button>
            )
          })}

        </div>

        <AnimatePresence mode="wait">
          {tab === 'pubs' && (
            <motion.ul
              key="pubs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-ink"
            >
              {publications.map((p, i) => (
                <PubRow key={p.id} p={p} index={i} />
              ))}
            </motion.ul>
          )}

          {tab === 'awards' && (
            <motion.ul
              key="awards"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-ink"
            >
              {awards.map((a, i) => (
                <AwardRow key={a.id} a={a} index={i} />
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
