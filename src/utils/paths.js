export function withBasePath(path) {
  if (!path || !path.startsWith('/') || /^[a-z][a-z\d+\-.]*:|^\/\//i.test(path)) {
    return path
  }

  const base = import.meta.env.BASE_URL || '/'
  const normalizedBase = base.endsWith('/') ? base : `${base}/`
  return `${normalizedBase}${path.replace(/^\/+/, '')}`
}
