export function Button({
  as = 'a',
  variant = 'primary',
  className = '',
  icon,
  iconNudge = 'x',
  children,
  ...props
}) {
  const Tag = as
  const base =
    'btn-premium group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3 font-display text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
  const variants = {
    primary: 'bg-accent text-bg',
    ghost: 'border border-glassborder bg-glass text-fg backdrop-blur-md',
  }
  const launch =
    iconNudge === 'y'
      ? 'btn-ico--y'
      : iconNudge === 'diag'
        ? 'btn-ico--diag'
        : iconNudge === 'none'
          ? ''
          : 'btn-ico--x'
  return (
    <Tag
      data-variant={variant}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      <span aria-hidden="true" className="btn-sheen" />
      <span className="relative z-[1]">{children}</span>
      {icon != null && (
        <span aria-hidden="true" className={`btn-ico relative z-[1] ${launch}`}>
          <span className="btn-ico__main">{icon}</span>
          <span className="btn-ico__ghost">{icon}</span>
        </span>
      )}
    </Tag>
  )
}
