export async function verifyToken(token) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/verify-token`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!response.ok) throw new Error('Invalid token')
    return true
  }