'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function OnlineUsers() {
  const [onlineUsers, setOnlineUsers] = useState(0)
  const [usersInRooms, setUsersInRooms] = useState(0)

  useEffect(() => {
    const socket = new WebSocket('ws://your-websocket-server-url')

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setOnlineUsers(data.onlineUsers)
      setUsersInRooms(data.usersInRooms)
    }

    return () => {
      socket.close()
    }
  }, [])

  return (
    <div className="flex space-x-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Online Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{onlineUsers}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Users in Rooms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{usersInRooms}</div>
        </CardContent>
      </Card>
    </div>
  )
}

