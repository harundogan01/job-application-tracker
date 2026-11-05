import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/ui/FormField'
import { Input } from '@/components/ui/Input'
import { FormError } from '@/features/auth/components/FormError'
import { loginSchema, type LoginValues } from '@/features/auth/schemas'
import { useAuth } from '@/features/auth/useAuth'
import { getErrorMessage } from '@/lib/errors'

export default function LoginPage() {
  const { signIn } = useAuth()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  // handleSubmit, doğrulama başarılıysa bu fonksiyonu tipli verilerle çağırır.
  // Fonksiyon Promise döndürdüğü sürece isSubmitting otomatik olarak true olur.
  const onSubmit = handleSubmit(async ({ email, password }) => {
    try {
      await signIn(email, password)
      // Yönlendirmeyi RedirectIfAuthenticated yapıyor, burada navigate gerekmiyor
    } catch (error) {
      // "root" hatası belirli bir alana değil, formun tamamına ait
      setError('root', { message: getErrorMessage(error) })
    }
  })

  return (
    <>
      <h1 className="text-xl font-semibold">Tekrar hoş geldin</h1>
      <p className="mt-1 text-sm text-gray-500">Başvurularını takip etmek için giriş yap.</p>

      <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
        <FormError message={errors.root?.message} />

        <FormField label="E-posta" error={errors.email?.message}>
          {(field) => (
            <Input {...field} type="email" autoComplete="email" {...register('email')} />
          )}
        </FormField>

        <FormField label="Şifre" error={errors.password?.message}>
          {(field) => (
            <Input
              {...field}
              type="password"
              autoComplete="current-password"
              {...register('password')}
            />
          )}
        </FormField>

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Giriş yap
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Hesabın yok mu?{' '}
        <Link to="/register" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
          Kayıt ol
        </Link>
      </p>
    </>
  )
}
