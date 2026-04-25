'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import type { User } from '@/lib/types';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const ALLOWED_LOGIN_CREDENTIALS = {
  email: 'victorjoseph@lendsqr.com',
  password: '123456',
} as const;

const AUTHENTICATED_USER: User = {
  id: 'victor-joseph',
  email: ALLOWED_LOGIN_CREDENTIALS.email,
  emailVerified: true,
  phoneNumber: '+234 803 000 0001',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    const normalizedEmail = values.email.trim().toLowerCase();
    const isAuthorizedUser =
      normalizedEmail === ALLOWED_LOGIN_CREDENTIALS.email &&
      values.password === ALLOWED_LOGIN_CREDENTIALS.password;

    if (!isAuthorizedUser) {
      setError('root', {
        type: 'manual',
        message: 'Invalid email or password.',
      });
      return;
    }

    clearErrors('root');

    const sessionUser: User = {
      ...AUTHENTICATED_USER,
      updatedAt: new Date().toISOString(),
    };

    login('mock-session-token', sessionUser);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-2">
        <section className="relative hidden bg-white lg:block">
          <Image
            src="/images/login/lendsqr-logo.svg"
            alt="Lendsqr logo"
            width={174}
            height={36}
            className="absolute left-[13.5%] top-[106px]"
            priority
          />
          <Image
            src="/images/login/pablo-sign-in.png"
            alt="Login illustration"
            width={600}
            height={338}
            className="absolute left-1/2 top-[281px] h-auto w-[82%] max-w-[600px] -translate-x-1/2"
            priority
          />
        </section>

        <section className="relative flex min-h-screen bg-white px-6 py-10 shadow-[0px_15px_90px_0px_rgba(0,0,0,0.03)] sm:px-10 sm:py-12 lg:block lg:min-h-[900px] lg:px-0 lg:py-0">
          <div className="mx-auto w-full max-w-[447px] lg:absolute lg:left-[116px] lg:top-[215px] lg:mx-0">
            <Image
              src="/images/login/lendsqr-logo.svg"
              alt="Lendsqr logo"
              width={174}
              height={36}
              className="lg:hidden"
              priority
            />

            <div className="mt-16 lg:mt-0">
              <h1 className="font-body text-[40px] font-bold leading-[normal] tracking-[-1.6px] text-[#213F7D]">
                Welcome!
              </h1>
              <p className="mt-[15px] text-[20px] font-normal leading-[normal] text-[#545F7D]">
                Enter details to login.
              </p>
            </div>

            <form
              className="mt-12 lg:mt-[68px]"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Email"
                  className="h-[50px] w-full rounded-[5px] border-2 border-[rgba(84,95,125,0.15)] bg-white px-4 text-[14px] font-normal text-[#213F7D] placeholder:text-[#545F7D99] focus:border-[#39CDCC] focus:outline-none"
                  {...register('email')}
                />
                {errors.email ? (
                  <p className="mt-2 text-xs text-[#d14343]">
                    {errors.email.message}
                  </p>
                ) : null}
              </div>

              <div className="mt-6">
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Password"
                    className="h-[50px] w-full rounded-[5px] border-2 border-[rgba(84,95,125,0.15)] bg-white px-4 pr-[78px] text-[14px] font-normal text-[#213F7D] placeholder:text-[#545F7D99] focus:border-[#39CDCC] focus:outline-none"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] font-semibold uppercase tracking-[1.2px] text-[#39CDCC]"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? 'HIDE' : 'SHOW'}
                  </button>
                </div>
                {errors.password ? (
                  <p className="mt-2 text-xs text-[#d14343]">
                    {errors.password.message}
                  </p>
                ) : null}
              </div>

              {errors.root?.message ? (
                <p className="mt-4 text-sm font-medium text-[#d14343]">
                  {errors.root.message}
                </p>
              ) : null}

              <Link
                href="#"
                className="mt-6 inline-flex text-[12px] font-semibold uppercase tracking-[1.2px] text-[#39CDCC]"
              >
                Forgot Password?
              </Link>

              <button
                type="submit"
                className="mt-[35px] h-[50px] w-full rounded-[8px] bg-[#39CDCC] text-[14px] font-semibold uppercase tracking-[1.4px] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing in...' : 'Log in'}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
