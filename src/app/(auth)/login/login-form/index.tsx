'use client'

import React, { useCallback, useRef } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Message } from '@/components/ui/message'
import { useAuth } from '@/providers/auth-provider'

type FormData = {
  email: string
  password: string
}

export const LoginForm: React.FC = () => {
  const searchParams = useSearchParams()
  const allParams = searchParams.toString() ? `?${searchParams.toString()}` : ''
  const redirect = useRef(searchParams.get('redirect'))
  const { login } = useAuth()
  const router = useRouter()
  const [error, setError] = React.useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      email: 'info@mana.do',
      password: 'test',
    },
  })

  const onSubmit = useCallback(
    async (data: FormData) => {
      try {
        console.log('Logging in...', data)
        const user = await login(data)
        if (user) {
          if (redirect?.current) {
            return router.push(redirect.current as string)
          }
          router.push('/')
        }
      } catch (error) {
        console.log('Error logging in...', error)
        setError('There was an error with the credentials provided. Please try again.')
      }
    },
    [login, router],
  )

  return (
    <div className="mx-auto grid w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl lg:text-3xl font-bold">Login</h1>
        <p className="text-balance text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <Message error={error} />
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              {...register('email')}
              placeholder="m@example.com"
              required
              // error={errors.email}
              type="email"
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link
                href={`/recover-password${allParams}`}
                className="ml-auto inline-block text-sm underline"
              >
                Forgot your password?
              </Link>
            </div>
            <Input
              type="password"
              required
              {...register('password')}
              // error={errors.password}
            />
          </div>
          <Button type="submit" className="w-full my-3" disabled={isSubmitting}>
            {isSubmitting ? 'Processing' : 'Login'}
          </Button>
          <Button variant="outline" className="w-full">
            Login with Google
          </Button>
        </div>
      </form>
      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account?{' '}
        <Link href={`/create-account${allParams}`} className="underline">
          Sign up
        </Link>
      </div>
    </div>
  )
}
