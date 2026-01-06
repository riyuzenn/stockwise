import { Suspense } from 'react'
import ProductPageClient from './page-client'


export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading product</div>}>
      <ProductPageClient />
    </Suspense>
  )
}