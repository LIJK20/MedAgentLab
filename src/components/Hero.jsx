import { Suspense, lazy } from 'react'
import { motion } from 'framer-motion'

const NeuralField = lazy(() => import('../scenes/NeuralField.jsx'))

/**
 * Hero — Clinical Editorial.
 *
 * 排版策略:
 *   - 不对称 12 列网格,标题在左,3D 神经场在右上漫出。
 *   - 主标题以中文为主,关键词用单行衬线斜体英文做"对比口音"。
 *   - 等宽字体只承载技术元数据(version / build / scope),保留学术页边白。
 */
export default function Hero() {
  return (
    <section
      id="hero"
      className="relative isolate min-h-[100svh] overflow-hidden border-b border-ink/10"
    >
      {/* 3D 神经粒子场 —— 偏右上,不抢标题 */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <Suspense fallback={null}>
          <NeuralField />
        </Suspense>
        {/* 左侧阅读区柔光遮罩,确保字色对比 */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(250,250,247,0.92) 0%, rgba(250,250,247,0.55) 38%, rgba(250,250,247,0) 70%)',
          }}
          aria-hidden
        />
      </div>

      <div className="mx-auto grid min-h-[100svh] max-w-[1320px] grid-cols-12 items-center gap-6 px-6 pb-24 pt-32 md:px-10 md:pt-36">
        <div className="col-span-12 md:col-span-8 lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3"
          >
            <span className="signal-dot" aria-hidden />
            <span className="capsule uppercase">
              兰州大学 · 信息科学与工程学院 · MedAgentLab
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="display mt-8 text-display-xl text-ink"
          >
            <span className="text-cyan_med">MedAgentLab</span>

          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 max-w-2xl font-sans text-base leading-relaxed text-ink/85 md:text-lg"
          >
            团队聚焦<strong className="font-medium">医疗多模态大模型</strong>、
            <strong className="font-medium">普适性神经信号编解码</strong>与
            <strong className="font-medium">脑疾病诊断与风险预警</strong>,
            构建可在真实放射工作流中可用、可审查、可部署的诊断感知系统。
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.36, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 grid max-w-2xl grid-cols-2 gap-x-10 gap-y-6 md:grid-cols-4"
          >
            {[
              ['04', '研究方向'],
              ['50+', '在岗成员'],
              ['200+', 'SCI 论文'],
              ['20+', '专利 / 软著'],
            ].map(([k, v]) => (
              <div key={v} className="border-l border-ink/15 pl-4">
                <div className="display text-2xl text-ink md:text-3xl">{k}</div>
                <div className="capsule mt-1 uppercase">{v}</div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.55 }}
            className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-4"
          >
            <a
              href="#research"
              className="group inline-flex items-center gap-3 border-b border-ink pb-1 font-mono text-xs uppercase tracking-wider2 text-ink"
            >
              查看研究成果
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
            <a
              href="#contact"
              className="group inline-flex items-center gap-3 font-mono text-xs uppercase tracking-wider2 text-mute hover:text-ink"
            >
              招生进行中
              <span className="transition-transform group-hover:translate-x-1">↗</span>
            </a>
          </motion.div>
        </div>

        {/* 右侧学术页边元数据 —— 保留英文等宽,作为"实验室期刊感"的视觉锚 */}
        <aside className="col-span-12 hidden md:col-span-4 lg:col-span-5 md:flex md:items-end md:justify-end">
          <div className="mr-2 flex flex-col items-end gap-3 text-right">

          </div>
        </aside>
      </div>

      {/* 底部跑马灯 —— 研究关键词,英文术语保留以维持检索一致性 */}
      <div className="absolute inset-x-0 bottom-0 overflow-hidden border-t border-ink/10 bg-paper/80 backdrop-blur-sm">
        <div className="marquee-track flex whitespace-nowrap py-3 font-mono text-[11px] uppercase tracking-wider2 text-mute">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex shrink-0 items-center gap-10 pr-10">
              <span>· 跨序列 MRI 合成</span>
              <span>· 诊断感知评估 (ΔNED)</span>
              <span>· 普适神经编解码</span>
              <span>· 脑龄预测</span>
              <span>· 低剂量 PET/CT 重建</span>
              <span>· SAM-Med 医学分割</span>
              <span>· 工业级具身视觉</span>
              <span>· 临床多智能体协同</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
