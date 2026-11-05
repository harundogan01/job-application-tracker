import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MailCheck } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/ui/FormField'
import { Input } from '@/components/ui/Input'
import { FormError } from '@/features/auth/components/FormError'
import { registerSchema, type RegisterValues } from '@/features/auth/schemas'
import { useAuth } from '@/features/auth/useAuth'
import { getErrorMessage } from '@/lib/errors'

export default function RegisterPage() {
  const { signUp } = useAuth()
  const [confirmationEmail, setConfirmationEmail] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '' },
    // İlk gönderimden sonra alanlar yazarken yeniden doğrulanır
    reValidateMode: 'onChange',
  })

  const onSubmit = handleSubmit(async ({ fullName, email, password }) => {
    try {
      const { needsEmailConfirmation } = await signUp({ fullName, email, password })
      if (needsEmailConfirmation) setConfirmationEmail(email)
    } catch (error) {
      setError('root', { message: getErrorMessage(error) })
    }
  })

  // Erken return: koşula göre tamamen farklı bir ekran göstermek için
  if (confirmationEmail) {
    return (
      <div className="text-center">
        <MailCheck className="mx-auto size-10 text-indigo-600" aria-hidden />
        <h1 className="mt-4 text-xl font-semibold">E-postanı kontrol et</h1>
        <p className="mt-2 text-sm text-gray-500">
          <strong>{confirmationEmail}</strong> adresine bir doğrulama bağlantısı gönderdik.
          Bağlantıya tıkladıktan sonra giriş yapabilirsin.
        </p>
        <Link
          to="/login"
          className="mt-6 inline-block text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
        >
          Giriş sayfasına dön
        </Link>
      </div>
    )
  }

  return (
    <>
      <h1 className="text-xl font-semibold">Hesap oluştur</h1>
      <p className="mt-1 text-sm text-gray-500">Birkaç saniyede başvurularını takip etmeye başla.</p>

      <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
        <FormError message={errors.root?.message} />

        <FormField label="Ad soyad" error={errors.fullName?.message}>
          {(field) => <Input {...field} autoComplete="name" {...register('fullName')} />}
        </FormField>

        <FormField label="E-posta" error={errors.email?.message}>
          {(field) => (
            <Input {...field} type="email" autoComplete="email" {...register('email')} />
          )}
        </FormField>

        <FormField
          label="Şifre"
          error={errors.password?.message}
          hint="En az 8 karakter, bir harf ve bir rakam."
        >
          {(field) => (
            <Input
              {...field}
              type="password"
              autoComplete="new-password"
              {...register('password')}
            />
          )}
        </FormField>

        <FormField label="Şifre (tekrar)" error={errors.confirmPassword?.message}>
          {(field) => (
            <Input
              {...field}
              type="password"
              autoComplete="new-password"
              {...register('confirmPassword')}
            />
          )}
        </FormField>

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Kayıt ol
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Zaten hesabın var mı?{' '}
        <Link to="/login" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
          Giriş yap
        </Link>
      </p>
    </>
  )
}
