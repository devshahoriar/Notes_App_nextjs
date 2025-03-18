/* eslint-disable @typescript-eslint/no-explicit-any */
import { tokenStore } from '@/lib/tokenStore'
import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

const ApiUrl = process.env.NEXT_PUBLIC_API_URL!

const useSocketIo = () => {
  const [connected, setConnected] = useState(false)
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(ApiUrl, {
        auth: {
          token: tokenStore.getToken(),
        },
      })
    }

    const socket = socketRef.current

    socket.on('connect', () => {
      setConnected(true)
    })

    socket.on('disconnect', () => {
      setConnected(false)
    })

    setConnected(socket.connected)

    return () => {
      socket.off('connect')
      socket.off('disconnect')
    }
  }, [])

  return { connected, socket: socketRef.current }
}

export default useSocketIo
