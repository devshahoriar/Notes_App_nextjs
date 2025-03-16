/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import useHandelChange from '@/hooks/useHandelChange'
import { z } from 'zod'
import { validateError } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import authService from '@/services/authService'

const loginSchema = z.object({
  email: z.string().email(),
  password: z
    .string({ message: 'Password is required.' })
    .min(6, { message: 'Password minimum length 6.' })
    .max(48),
})

const defaultFormData = {
  email: '',
  password: '',
}

export default function LoginPage() {
  const [inputs, setInputs] = useState(defaultFormData)
  const [error, setError] = useState('')
  const handelChange = useHandelChange(setInputs, () => {
    setError('')
  })
  const router = useRouter()
  const { isPending, mutate } = useMutation({
    mutationFn: authService.login,
    onError(error) {

      setError(error.message)
    },
    onSuccess() {
      router.push('/todos')
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const data = loginSchema.safeParse(inputs)
    if (!data.success) {
      return setError(validateError(data))
    }
    mutate({
      email: data.data.email,
      password: data.data.password,
    })
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md px-4">
        <Card className="border-slate-200 shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold">Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={inputs.email}
                  onChange={handelChange}
                  required
                  disabled={isPending}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="#"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={inputs.password}
                  onChange={handelChange}
                  required
                  disabled={isPending}
                />
              </div>
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Don&rsquo;t have an account?{' '}
              <Link
                href="/signup"
                className="text-primary font-medium hover:underline"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
