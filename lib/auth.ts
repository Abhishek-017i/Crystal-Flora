import jwt from 'jsonwebtoken'

export function isAdmin(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null
  try {
    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string
      role: string
    }
    if (decoded.role !== 'admin') return null
    return decoded
  } catch {
    return null
  }
}

export function getUser(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null
  try {
    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string
      email: string
      role: string
    }
    return decoded
  } catch {
    return null
  }
}