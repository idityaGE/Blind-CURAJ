export const handleChangeName = async (name: string) => {
  try {
    const res = await fetch('/api/update/name', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.error)
    }

    return res.json()
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update name')
  }
}