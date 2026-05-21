import { NextResponse } from 'next/server'

const FRANKFURTER_BASE = 'https://api.frankfurter.app'

export async function GET() {
  const endDate = new Date().toISOString().substring(0, 10)
  const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10)

  const response = await fetch(
    `${FRANKFURTER_BASE}/${startDate}..${endDate}?base=MXN&symbols=USD,EUR`,
  )

  if (!response.ok) {
    const text = await response.text()
    return NextResponse.json(
      { error: 'Exchange rate service unavailable', details: text },
      { status: response.status },
    )
  }

  const data = await response.json()
  return NextResponse.json(data)
}
