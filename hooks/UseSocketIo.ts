/* eslint-disable @typescript-eslint/no-explicit-any */
import { tokenStore } from '@/lib/tokenStore'
import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

const ApiUrl = process.env.NEXT_PUBLIC_API_URL!
let socket: Socket

const useSocketIo = () => {
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    setConnected(socket?.active)
  }, [socket?.active])
  
  if (socket?.active) {
    return { connected, socket }
  }

  socket = io(ApiUrl, {
    auth: {
      token: tokenStore.getToken(),
    },
  })

  socket.on('connect', () => {
    setConnected(true)
  })

  socket.on('disconnect', () => {
    setConnected(false)
  })

  return { connected, socket }
}

export default useSocketIo
