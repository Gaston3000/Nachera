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
    'group inline-flex items-center gap-2 rounded-full px-6 py-3 font-display text-sm font-semibold transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
  const variants = {
    primary:
      'bg-accent text-bg hover:shadow-[0_0_30px_-4px_var(--c-accent)] hover:-translate-y-0.5',
    ghost:
      'border border-glassborder bg-glass text-fg backdrop-blur-md hover:border-accent/60 hover:-translate-y-0.5',
  }
  const nudgeClass =
    iconNudge === 'y'
      ? 'group-hover:translate-y-0.5'
      : iconNudge === 'none'
        ? ''
        : 'group-hover:translate-x-0.5'
  return (
    <Tag className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
      {icon != null && (
        <span
          className={`transition-transform duration-200 ease-out motion-reduce:transform-none ${nudgeClass}`}
        >
          {icon}
        </span>
      )}
    </Tag>
  )
}
