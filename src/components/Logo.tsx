/** "AG" monogram used in the nav, the hire pill and the footer. */
export function Logo({ size = 28, title = "Abdullah Gamal" }: { size?: number; title?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label={title}>
      <rect width="64" height="64" rx="18" fill="currentColor" opacity="0.08" />
      <path d="M12 47 25 15h5l13 32h-6.4l-3-8.2H21.3l-3 8.2H12Zm11.1-13.6h8.7L27.5 22.6l-4.4 11.8Z" fill="currentColor" />
      <circle cx="49" cy="43.5" r="4.5" fill="var(--accent)" />
    </svg>
  )
}
