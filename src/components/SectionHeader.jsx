import { motion } from 'framer-motion'

/**
 * Editorial section header.
 *  §[index] · kicker(等宽元数据)
 *  title + accent(青色强调) —— 中文场景下不再使用 italic,改用色彩对比。
 *  顶部水平规则线在滚入视口时左对齐生长。
 */
export default function SectionHeader({ index, kicker, title, accent }) {
  return (
    <header className="relative mb-12 md:mb-20">
      <motion.div
        className="rule origin-left"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      />
      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="sect-mark">§{String(index).padStart(2, '0')} · {kicker}</span>
          <h2 className="display mt-3 text-display-lg text-ink">
            {title}
            {accent && <span className="text-cyan_med">{accent}</span>}
          </h2>
        </div>
        {/* 品牌锚点 —— 等宽英文是 MedAgentLab 的官方标识,刻意保留 */}
        <span className="capsule">MedAgentLab · Lanzhou University.</span>
      </div>
    </header>
  )
}
