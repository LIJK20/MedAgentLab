<!--
  MedAgentLab — README
  Editorial · Clinical · Computational
-->

# MedAgentLab

> *Medical Artificial Intelligence & Agent Laboratory*
> 兰州大学 · 信息科学与工程学院 · 医疗人工智能与智能体实验室
> 聚焦医疗多模态大模型、普适性神经信号编解码与脑疾病诊断 —— 2026 招生进行中。

实验室官网,采用单页 editorial 风格,面向中国大学生招生。
作为真实生产代码库构建,而非套用模板。

---

## 0 · Design direction

| | |
|---|---|
| **Aesthetic** | *Clinical Editorial* — scientific journal × calibration target × R3F particle field |
| **DFII score** | **15** (Impact 4 · Fit 5 · Feasibility 4 · Performance 3 − Risk 1) |
| **Differentiation anchor** | Fraunces variable serif + §-numbered sections + JetBrains-Mono "capsules" + a single medical-cyan accent. If you remove the logo, the type system alone identifies the site. |
| **Type stack** | Fraunces (display, italic) · Geist (sans, body) · JetBrains Mono (metadata) |
| **Palette** | `#0F172A` ink · `#FAFAF7` paper · `#2DB7C8` cyan_med · ≤ 1 accent rule |
| **Motion** | Pure-CSS rule grow + Framer Motion scroll fade-ins. No decorative micro-motion. |

> **Avoids generic AI UI by:** (a) refusing Inter/Roboto, (b) refusing purple-gradient SaaS hero, (c) using academic §01 numbering instead of feature-card grids, (d) rendering the QR placeholder as a calibration target rather than a skeleton box.

---

## 1 · Project initialization

If you are starting from a clean machine:

```bash
# Node 18+ recommended (R3F + Vite 5)
node -v

# inside the repo
npm install         # ~30 s
npm run dev         # → http://localhost:5173
npm run build       # → ./dist
npm run preview     # serve ./dist on :4173 for sanity check
```

If you wanted to scaffold this from scratch, the equivalent of what we already produced is:

```bash
npm create vite@latest medagentlab -- --template react
cd medagentlab
npm i three @react-three/fiber @react-three/drei framer-motion lucide-react
npm i -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

…then drop in the configs and `src/` tree below.

---

## 2 · Core code structure

```
MedAgentLab/
├── deploy/
│   ├── deploy.sh                   # one-shot build + rsync + nginx reload
│   └── nginx-medagentlab.conf      # production server block (gzip, SPA, cache)
├── scripts/
│   ├── make_qr.py                  # QR generator with logo-seal overlay
│   └── requirements.txt
├── public/
│   └── favicon.svg                 # custom MedAgentLab seal
├── src/
│   ├── App.jsx                     # journal-issue layout (§00 → §04 → colophon)
│   ├── main.jsx
│   ├── styles.css                  # Tailwind layers + paper-grain + animations
│   ├── components/
│   │   ├── Nav.jsx                 # sticky, blur-on-scroll
│   │   ├── Hero.jsx                # asymmetric hero with R3F neural field
│   │   ├── SectionHeader.jsx       # §NN heading + animated rule
│   │   ├── Overview.jsx            # 3 directors + 4 research tracks
│   │   ├── DirectorCard.jsx        # initials-portrait, scan-line, hover lift
│   │   ├── Team.jsx                # filterable grid (track-faceted)
│   │   ├── Research.jsx            # tabs: Publications / Awards
│   │   ├── Contact.jsx             # inverted block, calibration-target QR
│   │   └── Footer.jsx              # colophon strip
│   ├── scenes/
│   │   └── NeuralField.jsx         # lightweight R3F particle/edge graph
│   └── data/
│       ├── directors.js            # 3 导师 · 真实简介 + roleTag
│       ├── members.js              # 在岗成员 + 研究方向 facet
│       └── research.js             # 论文 + 竞赛获奖(示例占位)
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md  ← you are here
```

All component code is already on disk under those exact paths.

---

## 3 · Key components — what to look at first

| Component | Why it matters |
|---|---|
| `src/scenes/NeuralField.jsx` | The 3D Hero. Off-center, ~600 particles, Catmull-Rom edges, cursor-parallax. Capped at `dpr=[1,2]` for laptops. |
| `src/components/Hero.jsx` | Asymmetric 12-column grid; **no centered headline**. Demonstrates the editorial stance. |
| `src/components/DirectorCard.jsx` | Initials-as-portrait + scanline texture. Avoids the "stock-photo professor card" trope. |
| `src/components/Team.jsx` | `useMemo` + `AnimatePresence` filtered grid. All 19 members, 9 research tracks. |
| `src/components/Contact.jsx` | The single tonal inversion (ink ground / paper text). The QR placeholder is a deliberate fiducial pattern, not a skeleton. |

If you want to replace the QR placeholder with a real one, just drop `public/qr.png` and change `<CalibrationQR/>` → `<img src="/qr.png" alt="…" />`.

---

## 4 · Server deployment (Ubuntu 22.04 + Nginx)

### 4.1 Provision the host (once)

```bash
ssh root@<your-server-ip>

# Create deploy user
adduser deploy && usermod -aG sudo deploy
rsync --archive ~/.ssh /home/deploy/ && chown -R deploy:deploy /home/deploy/.ssh

# Install Nginx + Node (only if you want to build *on* the server)
sudo apt update
sudo apt install -y nginx
# (optional) curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
# (optional) sudo apt install -y nodejs

# Open ports
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### 4.2 Deploy in one command (from your laptop)

```bash
REMOTE=deploy@<your-server-ip> ./deploy/deploy.sh
```

The script does:

1. `npm ci && npm run build`
2. `rsync -az --delete dist/ → /var/www/medagentlab/`
3. Installs `deploy/nginx-medagentlab.conf` to `/etc/nginx/sites-available/medagentlab` and symlinks it into `sites-enabled/`
4. `sudo nginx -t && sudo systemctl reload nginx`

After it finishes, your site is reachable at `http://<your-server-ip>/`.

### 4.3 Add HTTPS (after a domain is pointed at the box)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d medagentlab.example.com
# Certbot rewrites the server block in place and installs a renewal timer.
```

### 4.4 What the Nginx config gives you

* SPA fallback (`try_files $uri $uri/ /index.html`)
* `Cache-Control: public, immutable` for hashed JS/CSS/font assets, `no-store` for `index.html`
* gzip on text/* + JS/CSS/SVG/woff2
* Hardened headers (`X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`)

Full config: `deploy/nginx-medagentlab.conf`.

---

## 5 · QR code with embedded logo

After your site is live (and ideally HTTPS), generate a printable QR:

```bash
# One-time setup
python3 -m venv .venv && source .venv/bin/activate
pip install -r scripts/requirements.txt

# Generate
python scripts/make_qr.py \
    --url  https://medagentlab.example.com \
    --logo public/favicon.svg \
    --out  public/qr
```

Output:

* `public/qr.png` — rounded-module QR with a circular **MedAgentLab seal** (paper disk + cyan-med ring + center logo) at center. Encoded with **error-correction H** so the seal does not break decoding.
* `public/qr.svg` — clean vector QR (no logo overlay) for embedding directly in the Contact section if you ever want to retire the calibration-target placeholder.

**Why error-correction H + 22% logo footprint?**
Reed–Solomon EC-H recovers up to 30% damaged modules. Keeping the embedded seal under 22% of total area leaves a comfortable safety margin so a slightly bent printed poster still scans.

Always test the produced PNG with at least two phones (iPhone Camera + WeChat Scan) before sending it to print.

---

## 6 · Operator checklist

- [x] Clear aesthetic direction stated (*Clinical Editorial*)
- [x] DFII = 15 ≥ 8
- [x] One memorable design anchor (§NN numbering + Fraunces + cyan rule)
- [x] No generic fonts/colors/layouts — Inter/purple/symmetry all rejected
- [x] Code matches design ambition — R3F where required, CSS-first elsewhere
- [x] Accessible & performant — focus rings preserved, R3F dpr capped, gzip enabled

---

## 7 · License & intent

All academic content currently in `src/data/research.js` is **illustrative placeholder data** intended only to demonstrate UI rhythm. Replace with real publications and awards before going public. The real director profiles in `src/data/directors.js` are sourced from the lab's official 2026 招生海报 and may be updated as the team grows.

Crafted with discipline · not with templates.
用研究的方式构建 · 而非套用模板。
