export function GlassPanel({ as = 'div', className = '', children, ...props }) {
  const Tag = as
  return (
    <Tag
      className={`relative rounded-2xl border border-glassborder bg-glass backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}
