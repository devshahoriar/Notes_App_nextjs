/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/components/ui/password-input'
import useHandelChange from '@/hooks/useHandelChange'
import authService from '@/services/authService'
import { validateError } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

const registerSchema = z
  .object({
    email: z.string().email(),
    password: z
      .string({ message: 'Password is required.' })
      .min(6, { message: 'Password minimum length 6.' })
      .max(48),
    confirmPassword: z
      .string({ message: 'Password is required.' })
      .min(6, { message: 'Password minimum length 6.' })
      .max(48),
    name: z
      .string({ message: 'Name is required.' })
      .min(2, { message: 'Name is required.' })
      .max(100),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

const defaultFormData = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
}

export default function RegisterPage() {
  const [formData, setFormData] = useState(defaultFormData)

  const [error, setError] = useState('')
  const router = useRouter()
  const { isPending, mutate } = useMutation({
    mutationFn: authService.register,
    onError: (err) => {
      console.log(err)
      setError(err.message)
    },
    onSuccess: () => {
      router.push('/login')
      setFormData(defaultFormData)
      toast.success('Account created successfully.')
    },
  })

  const handleChange = useHandelChange(setFormData, () => {
    setError('')
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const data = registerSchema.safeParse(formData)
    if (!data.success) {
      return setError(validateError(data))
    }

    mutate({
      email: data.data.email,
      password: data.data.password,
      name: data.data.name,
    })
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md px-4">
        <Card className="border-slate-200 shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold">Register</CardTitle>
            <CardDescription>Create an account to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  name="name"
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <PasswordInput
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <PasswordInput
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={isPending}
                />
              </div>
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? 'Creating Account...' : 'Register'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-primary font-medium hover:underline"
              >
                Login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
