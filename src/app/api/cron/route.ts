import { startAutoDiscountCron } from '@/lib/cron/autoDiscount'

let started = false

export async function POST(req: Request) {
  console.log(`[[NN]] ${started}`)
  // if (!started) {
  //   startAutoDiscountCron()
  //   started = true
  // }

  // return new Response('Auto discount cron started')
}
