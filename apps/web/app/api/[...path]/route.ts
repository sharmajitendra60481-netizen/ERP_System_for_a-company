import { NextRequest, NextResponse } from 'next/server'

const API_BASE = process.env.API_URL || 'http://localhost:4000'

// Proxy all requests to the NestJS backend
async function proxyRequest(req: NextRequest, path: string) {
  try {
    const url = `${API_BASE}${path}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    const auth = req.headers.get('authorization')
    if (auth) headers['Authorization'] = auth

    const isGet = req.method === 'GET' || req.method === 'DELETE'
    const body = isGet ? undefined : await req.text()

    const response = await fetch(url, {
      method: req.method,
      headers,
      body: body || undefined,
    })

    const data = await response.json().catch(() => ({}))
    return NextResponse.json(data, { status: response.status })
  } catch (err: any) {
    return NextResponse.json({ message: 'API server unavailable' }, { status: 503 })
  }
}

type RouteParams = { params: Promise<{ path: string[] }> }

async function getPath({ params }: RouteParams) {
  const { path } = await params
  return '/' + path.join('/')
}

export async function GET(req: NextRequest, context: RouteParams) {
  const path = await getPath(context)
  return proxyRequest(req, path)
}

export async function POST(req: NextRequest, context: RouteParams) {
  const path = await getPath(context)
  return proxyRequest(req, path)
}

export async function PATCH(req: NextRequest, context: RouteParams) {
  const path = await getPath(context)
  return proxyRequest(req, path)
}

export async function PUT(req: NextRequest, context: RouteParams) {
  const path = await getPath(context)
  return proxyRequest(req, path)
}

export async function DELETE(req: NextRequest, context: RouteParams) {
  const path = await getPath(context)
  return proxyRequest(req, path)
}
