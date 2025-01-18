import { NextResponse } from 'next/server'
import axios from 'axios'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get('username')

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 })
  }

  try {
    const response = await axios.get(
      `https://github-readme-stats.vercel.app/api?username=${username}`,
      { responseType: 'text' }
    )
    return new NextResponse(response.data, {
      headers: { 'Content-Type': 'text/plain' }
    })
  } catch (error) {
    console.error('Error fetching GitHub stats:', error)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}