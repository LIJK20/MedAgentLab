import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'

import Footer from '../components/Footer.jsx'
import Nav from '../components/Nav.jsx'
import { getTrackBySlug } from '../data/tracks.js'

export default function TrackDetail() {
  const { slug } = useParams()
  const track = getTrackBySlug(slug)

  if (!track) return <Navigate to="/home" replace />

  return (
    <div className="relative min-h-screen bg-paper text-ink">
      <Nav />
      <main className="pt-24">
        <section className="relative border-y border-ink bg-paper">
          <div className="mx-auto grid max-w-[1320px] grid-cols-12 px-6 md:px-10">
            <div className="col-span-12 border-ink/10 py-8 md:col-span-3 md:border-r md:py-16">
              <Link
                to="/home#overview"
                className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider2 text-mute underline-offset-4 hover:text-ink hover:underline"
              >
                <ArrowLeft size={14} strokeWidth={1.5} />
                返回研究方向
              </Link>
              <div className="mt-12 font-mono text-[11px] uppercase tracking-wider2 text-mute">
                {track.code}
              </div>
              <div className="mt-3 border-t border-ink/20 pt-3 font-mono text-[11px] uppercase tracking-wider2 text-ink">
                {track.note}
              </div>
            </div>

            <div className="col-span-12 py-12 md:col-span-9 md:py-16 md:pl-12">
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-cyan_med">
                Research Track
              </p>
              <h1 className="display mt-4 max-w-5xl text-[3rem] leading-[0.98] text-ink md:text-[5.6rem]">
                {track.title}
              </h1>
              <p className="mt-4 font-mono text-xs uppercase tracking-wider2 text-mute">
                {track.en}
              </p>
              <p className="mt-10 max-w-3xl text-xl leading-relaxed text-ink/78">
                {track.summary}
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1320px] grid-cols-12 gap-y-12 px-6 py-20 md:px-10 md:py-28">
          <div className="col-span-12 md:col-span-4">
            <div className="sticky top-24">
              <div className="font-mono text-[11px] uppercase tracking-wider2 text-mute">
                方向简介
              </div>
              <div className="mt-4 h-px w-24 bg-ink" />
            </div>
          </div>

          <div className="col-span-12 md:col-span-8">
            <p className="text-[17px] leading-[1.9] text-ink/82 md:text-lg">
              {track.description}
            </p>

            <DetailBlock title="重点问题" items={track.problems} />
            <DetailBlock title="常用方法" items={track.methods} />

            <div className="mt-14 border border-ink/15 p-6 md:p-8">
              <div className="font-mono text-[11px] uppercase tracking-wider2 text-mute">
                适合加入的同学
              </div>
              <p className="mt-4 text-[16px] leading-relaxed text-ink/80">
                {track.studentFit}
              </p>
              <Link
                to="/home#contact"
                className="mt-7 inline-flex items-center gap-2 border border-ink px-4 py-3 font-mono text-[11px] uppercase tracking-wider2 text-ink transition-colors hover:bg-ink hover:text-paper"
              >
                联系我们
                <ArrowUpRight size={14} strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

function DetailBlock({ title, items }) {
  return (
    <div className="mt-14">
      <h2 className="display text-3xl text-ink">{title}</h2>
      <ol className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
        {items.map((item, index) => (
          <li key={item} className="grid grid-cols-12 gap-4 py-5">
            <span className="col-span-2 font-mono text-[11px] uppercase tracking-wider2 text-mute md:col-span-1">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="col-span-10 text-[16px] leading-relaxed text-ink/80 md:col-span-11">
              {item}
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}
