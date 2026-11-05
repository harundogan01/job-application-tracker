import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import LoginPage from '@/features/auth/pages/LoginPage'
import { AuthError } from '@/features/auth/types'
import { renderWithProviders } from '@/test/render'

describe('LoginPage', () => {
  it('boş gönderildiğinde doğrulama hatalarını gösterir ve giriş denemez', async () => {
    // vi.fn(): çağrılıp çağrılmadığını ve hangi argümanlarla çağrıldığını takip eden sahte fonksiyon
    const signIn = vi.fn()
    const { user } = renderWithProviders(<LoginPage />, {
      initialPath: '/login',
      auth: { status: 'unauthenticated', user: null, signIn },
    })

    await user.click(screen.getByRole('button', { name: 'Giriş yap' }))

    // findBy... asenkron: eleman görünene kadar bekler (varsayılan 1 saniye)
    expect(await screen.findByText('E-posta adresi gerekli.')).toBeInTheDocument()
    expect(screen.getByText('Şifre gerekli.')).toBeInTheDocument()
    expect(signIn).not.toHaveBeenCalled()
  })

  it('geçersiz e-posta formatını yakalar', async () => {
    const { user } = renderWithProviders(<LoginPage />, {
      initialPath: '/login',
      auth: { status: 'unauthenticated', user: null },
    })

    await user.type(screen.getByLabelText('E-posta'), 'harun@')
    await user.type(screen.getByLabelText('Şifre'), 'abc12345')
    await user.click(screen.getByRole('button', { name: 'Giriş yap' }))

    expect(await screen.findByText('Geçerli bir e-posta adresi gir.')).toBeInTheDocument()
  })

  it('girilen bilgilerle signIn fonksiyonunu çağırır', async () => {
    const signIn = vi.fn().mockResolvedValue(undefined)
    const { user } = renderWithProviders(<LoginPage />, {
      initialPath: '/login',
      auth: { status: 'unauthenticated', user: null, signIn },
    })

    await user.type(screen.getByLabelText('E-posta'), '  harun@example.com ')
    await user.type(screen.getByLabelText('Şifre'), 'abc12345')
    await user.click(screen.getByRole('button', { name: 'Giriş yap' }))

    // Zod şemasındaki trim() sayesinde boşluklar temizlenmiş olmalı
    await vi.waitFor(() => expect(signIn).toHaveBeenCalledWith('harun@example.com', 'abc12345'))
  })

  it('sunucudan gelen hatayı formun üstünde gösterir', async () => {
    const signIn = vi.fn().mockRejectedValue(new AuthError('E-posta veya şifre hatalı.'))
    const { user } = renderWithProviders(<LoginPage />, {
      initialPath: '/login',
      auth: { status: 'unauthenticated', user: null, signIn },
    })

    await user.type(screen.getByLabelText('E-posta'), 'harun@example.com')
    await user.type(screen.getByLabelText('Şifre'), 'yanlis-sifre')
    await user.click(screen.getByRole('button', { name: 'Giriş yap' }))

    // role="alert" olan eleman: FormError bileşeni
    expect(await screen.findByRole('alert')).toHaveTextContent('E-posta veya şifre hatalı.')
  })
})
