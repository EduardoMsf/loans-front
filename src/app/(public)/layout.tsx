export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex min-h-screen items-center justify-center p-4"
      style={{ background: 'var(--color-bg)' }}
    >
      {children}
    </div>
  )
}
