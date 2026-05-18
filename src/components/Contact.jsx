import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Mail, Clock, ArrowUpRight } from 'lucide-react'

const MAJORS = [
  '计算机',
  '自动化',
  '数学',
  '医学影像',
  '生物医学工程',
  '电子信息',
  '统计 / 数据科学',
]

/**
 * Contact — inverted block.
 *
 * Aesthetic intent:
 *   - Flip to ink ground / paper text. The page has been white-on-ink throughout;
 *     this is the single tonal inversion, used as a closing visual statement.
 *   - QR placeholder is rendered as an ASCII-style calibration target,
 *     not a generic skeleton box — it survives even before a real PNG is dropped in.
 *   - Form fields use bottom-rule inputs (no bordered boxes) — editorial form rhythm.
 */
export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', major: '', msg: '' })
  const [submitted, setSubmitted] = useState(false)

  function update(k) {
    return (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  }

  function submit(e) {
    e.preventDefault()
    // Client-only mock — wire to a real endpoint later.
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4200)
  }

  return (
    <section
      id="contact"
      className="relative isolate overflow-hidden bg-ink py-24 text-paper md:py-32"
    >
      {/* Faint vertical guide rules — the "graph paper" hint of a lab notebook */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(250,250,247,1) 1px, transparent 1px)',
          backgroundSize: '80px 100%',
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1320px] px-6 md:px-10">
        {/* Section header — re-implemented inline because the global one assumes ink-on-paper */}
        <motion.div
          className="origin-left bg-paper"
          style={{ height: 1 }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="mt-6 mb-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-wider2 text-paper/55">
              §05 · 联系我们 · 招生信息
            </span>
            <h2 className="display mt-3 text-display-lg text-paper">
              加入 <span className="text-cyan_med">MedAgentLab</span> 团队
            </h2>
          </div>
          <span className="font-mono text-[11px] uppercase tracking-wider2 text-paper/55">
            兰州大学 · 榆中校区 · 致远楼 421
          </span>
        </div>

        <div className="grid grid-cols-12 gap-x-6 gap-y-16 md:gap-x-10">
          {/* Left — recruiting copy + meta */}
          <div className="col-span-12 lg:col-span-5">
            <p className="font-sans text-[17px] leading-[1.7] text-paper/90 md:text-lg">
              我们正在招募对
              <span className="text-cyan_med font-medium"> 医疗多模态大模型 </span>
              、
              <span className="text-cyan_med font-medium"> 神经信号编解码 </span>
              与
              <span className="text-cyan_med font-medium"> 临床智能体 </span>
              抱有研究热情的同学。
            </p>

            <p className="mt-6 text-sm leading-relaxed text-paper/65">
              欢迎来自计算机、自动化、数学、医学影像等专业背景的本科生 / 研究生加入。
              我们希望招到对上述方向有热情，愿意花时间在其中认真钻研的同学。
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {MAJORS.map((m) => (
                <span
                  key={m}
                  className="border border-paper/25 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider2 text-paper/75"
                >
                  {m}
                </span>
              ))}
            </div>

            {/* Coordinates block */}
            <ul className="mt-12 space-y-5">
              <ContactRow icon={MapPin} label="实验室地址">
                兰州大学 · 榆中校区 · 致远楼 421
                <span className="block text-paper/55">
                  Lanzhou University · Yuzhong Campus
                </span>
              </ContactRow>
              <ContactRow icon={Mail} label="联系邮箱">
                <a
                  href="mailto:medagentlab@lzu.edu.cn"
                  className="underline-offset-4 hover:underline"
                >
                  medagentlab@163.com
                </a>
              </ContactRow>
              <ContactRow icon={Clock} label="工作时间">
                周一至周五 · 09:00 – 21:00
              </ContactRow>
            </ul>
          </div>

          {/* Middle — form */}
          <form
            onSubmit={submit}
            className="col-span-12 flex flex-col gap-8 lg:col-span-4"
          >
            <FieldGroup label="01 · 姓名">
              <input
                required
                value={form.name}
                onChange={update('name')}
                placeholder="王小明"
                autoComplete="name"
                className="w-full bg-transparent py-2 font-sans text-base text-paper placeholder:text-paper/35 focus:outline-none"
              />
            </FieldGroup>

            <FieldGroup label="02 · 邮箱">
              <input
                required
                type="email"
                value={form.email}
                onChange={update('email')}
                placeholder="you@lzu.edu.cn"
                autoComplete="email"
                className="w-full bg-transparent py-2 font-sans text-base text-paper placeholder:text-paper/35 focus:outline-none"
              />
            </FieldGroup>

            <FieldGroup label="03 · 专业 / 年级">
              <input
                value={form.major}
                onChange={update('major')}
                placeholder="例:计算机科学,本科二年级"
                className="w-full bg-transparent py-2 font-sans text-base text-paper placeholder:text-paper/35 focus:outline-none"
              />
            </FieldGroup>

            <FieldGroup label="04 · 自我介绍">
              <textarea
                rows={4}
                value={form.msg}
                onChange={update('msg')}
                placeholder="介绍一下你想做的方向或加入实验室的原因…"
                className="w-full resize-none bg-transparent py-2 font-sans text-base leading-relaxed text-paper placeholder:text-paper/35 focus:outline-none"
              />
            </FieldGroup>

            <button
              type="submit"
              className="group mt-2 inline-flex items-center justify-between border border-paper px-5 py-3.5 font-mono text-xs uppercase tracking-wider2 text-paper transition-colors hover:bg-paper hover:text-ink"
            >
              <span>{submitted ? '提交成功 · 我们将尽快回复' : '提交申请'}</span>
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </button>
          </form>

          {/* Right — QR placeholder as calibration target */}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */

function ContactRow({ icon: Icon, label, children }) {
  return (
    <li className="flex gap-4">
      <div className="mt-1 grid h-9 w-9 shrink-0 place-items-center border border-paper/25">
        <Icon size={15} className="text-paper/80" strokeWidth={1.4} />
      </div>
      <div className="min-w-0">
        <div className="font-mono text-[10px] uppercase tracking-wider2 text-paper/45">
          {label}
        </div>
        <div className="mt-1 text-[15px] leading-relaxed text-paper/90">
          {children}
        </div>
      </div>
    </li>
  )
}

function FieldGroup({ label, children }) {
  return (
    <label className="group block border-b border-paper/25 pb-1 transition-colors focus-within:border-cyan_med">
      <span className="font-mono text-[10px] uppercase tracking-wider2 text-paper/50">
        {label}
      </span>
      {children}
    </label>
  )
}

/**
 * CalibrationQR — placeholder rendered as an inline SVG that resembles a
 * QR registration / fiducial pattern. When you have a real QR, just drop a
 * <img src="/qr.png"> in place of this component.
 */
function CalibrationQR() {
  return (
    <div className="relative">
      <div
        className="grid h-44 w-44 place-items-center border border-paper/30 bg-paper/5"
        aria-label="QR code placeholder"
        role="img"
      >
        <svg
          viewBox="0 0 100 100"
          className="h-32 w-32 text-paper"
          fill="currentColor"
          aria-hidden
        >
          {/* three corner finders */}
          <CornerFinder x={4} y={4} />
          <CornerFinder x={70} y={4} />
          <CornerFinder x={4} y={70} />
          {/* synthetic data cells — deterministic, looks "QR-like" without a real payload */}
          {Array.from({ length: 60 }).map((_, i) => {
            const cx = 32 + ((i * 7) % 36)
            const cy = 32 + (Math.floor((i * 11) / 6) % 36)
            return <rect key={i} x={cx} y={cy} width="3" height="3" />
          })}
          {/* alignment dot lower-right */}
          <rect x="74" y="74" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" />
          <rect x="80" y="80" width="10" height="10" />
        </svg>
      </div>
      {/* corner ticks (camera fiducial vibe) */}
      {['-top-2 -left-2', '-top-2 -right-2', '-bottom-2 -left-2', '-bottom-2 -right-2'].map(
        (pos) => (
          <span
            key={pos}
            className={`absolute h-3 w-3 border-cyan_med ${pos} ${
              pos.includes('top') ? 'border-t-2' : 'border-b-2'
            } ${pos.includes('left') ? 'border-l-2' : 'border-r-2'}`}
            aria-hidden
          />
        )
      )}
    </div>
  )
}

function CornerFinder({ x, y }) {
  return (
    <g>
      <rect x={x} y={y} width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <rect x={x + 6} y={y + 6} width="10" height="10" />
    </g>
  )
}
