export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-slate-50 p-4 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900">
      {children}
    </div>
  )
}
