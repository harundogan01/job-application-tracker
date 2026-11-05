import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import RegisterPage from '@/features/auth/pages/RegisterPage'
import { renderWithProviders } from '@/test/render'

function renderRegister(signUp = vi.fn().mockResolvedValue({ needsEmailConfirmation: false })) {
  const result = renderWithProviders(<RegisterPage />, {
    initialPath: '/register',
    auth: { status: 'unauthenticated', user: null, signUp },
  })

  // Aynı adımları her testte tekrar yazmamak için küçük bir yardımcı
  const fillForm = async (values: { password: string; confirmPassword: string }) => {
    await result.user.type(screen.getByLabelText('Ad soyad'), 'Harun Doğan')
    await result.user.type(screen.getByLabelText('E-posta'), 'harun@example.com')
    // getByLabelText varsayılan olarak tam eşleşme arar: "Şifre (tekrar)" ile karışmaz
    await result.user.type(screen.getByLabelText('Şifre'), values.password)
    await result.user.type(screen.getByLabelText('Şifre (tekrar)'), values.confirmPassword)
    await result.user.click(screen.getByRole('button', { name: 'Kayıt ol' }))
  }

  return { ...result, signUp, fillForm }
}

describe('RegisterPage', () => {
  it('şifreler eşleşmezse hata gösterir', async () => {
    const { fillForm, signUp } = renderRegister()

    await fillForm({ password: 'abc12345', confirmPassword: 'abc12346' })

    expect(await screen.findByText('Şifreler eşleşmiyor.')).toBeInTheDocument()
    expect(signUp).not.toHaveBeenCalled()
  })

  it('zayıf şifreyi kabul etmez', async () => {
    const { fillForm } = renderRegister()

    await fillForm({ password: 'abcdefgh', confirmPassword: 'abcdefgh' })

    expect(await screen.findByText('Şifre en az bir rakam içermeli.')).toBeInTheDocument()
  })

  it('e-posta doğrulaması gerekiyorsa bilgilendirme ekranı gösterir', async () => {
    const signUp = vi.fn().mockResolvedValue({ needsEmailConfirmation: true })
    const { fillForm } = renderRegister(signUp)

    await fillForm({ password: 'abc12345', confirmPassword: 'abc12345' })

    expect(await screen.findByRole('heading', { name: 'E-postanı kontrol et' })).toBeInTheDocument()
    expect(signUp).toHaveBeenCalledWith({
      fullName: 'Harun Doğan',
      email: 'harun@example.com',
      password: 'abc12345',
    })
  })
})
