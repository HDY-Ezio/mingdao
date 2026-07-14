import { Suspense } from 'react'
import ClientPage from './client-page'

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-stone-50"><p>加载中...</p></div>}>
      <ClientPage />
    </Suspense>
  )
}
