'use client'

import authService from '@/services/authService'
import { useQuery } from '@tanstack/react-query'
import { Loader } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ReactNode, useEffect } from 'react'

const AuthLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter()

  const { isLoading, isError, isSuccess } = useQuery({
    queryKey: ['user'],
    queryFn: authService.refreshToken,
    staleTime: 0,
    retry: false,
  })

  useEffect(() => {
    if (isError) {
      router.push('/login')
    }
  }, [isError, router])

  if (isLoading) {
    return (
      <div className="h-[95vh] w-full flex justify-center items-center">
        <Loader className="animate-spin" />
      </div>
    )
  }

  if (isSuccess) {
    return <>{children}</>
  }

  return null
}

export default AuthLayout
