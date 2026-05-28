import { motion } from 'framer-motion'
import { withBasePath } from '../utils/paths.js'

/**
 * Director card — editorial portrait.
 *  Uses real mentor portraits when provided, with initials as a graceful
 *  fallback. No drop shadows by default — shadow appears on hover only.
 */
export default function DirectorCard({ d, index }) {
  const isAccent = d.accentTone === 'cyan'

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-15% 0px' }}
      transition={{ duration: 0.8, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="lift group flex h-full flex-col border border-ink/15 bg-paper p-6 md:p-8"
    >
      <div className="flex items-start justify-between">
        <span className="capsule uppercase">导师 · {String(index + 1).padStart(2, '0')}</span>
        <span className="capsule uppercase">{d.affiliation}</span>
      </div>

      {/* Portrait */}
      <div
        className={`relative mt-6 aspect-[4/5] w-full overflow-hidden ${
          isAccent ? 'bg-cyan_med' : 'bg-ink'
        }`}
      >
        {d.photo ? (
          <img
            src={withBasePath(d.photo)}
            alt={`${d.name}导师照片`}
            className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="display text-paper"
              style={{ fontSize: 'clamp(3.5rem, 8vw, 6rem)', letterSpacing: '-0.04em' }}
            >
              {d.initials}
            </span>
          </div>
        )}
        {/* Scan-line texture for instrument feel */}
        <div
          className="absolute inset-0 opacity-20 mix-blend-overlay"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, rgba(250,250,247,0.06) 0 1px, transparent 1px 4px)',
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink/75 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span className="capsule text-paper/70">{d.nameEn}</span>
          <span className="capsule text-paper/70">{d.roleTag}</span>
        </div>
      </div>

      <h3 className="display mt-6 text-3xl text-ink md:text-4xl">{d.name}</h3>
      <div className="mt-2 capsule uppercase">{d.title}</div>

      <p className="mt-5 text-[15px] leading-relaxed text-ink/80">{d.bio}</p>

      <div className="mt-auto flex flex-wrap gap-2 pt-6">
        {d.keywords.map((k) => (
          <span
            key={k}
            className="border border-ink/20 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider2 text-ink/70"
          >
            {k}
          </span>
        ))}
      </div>
    </motion.article>
  )
}
