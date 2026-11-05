/**
 * İlk bileşen testi: en basit haliyle bir testin anatomisi.
 *
 * Her test üç adımdan oluşur (Arrange - Act - Assert):
 *   1. Hazırla: bileşeni render et
 *   2. Yap: kullanıcı gibi etkileşimde bulun (gerekirse)
 *   3. Kontrol et: ekranda beklenen sonucu doğrula
 */
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FormField } from '@/components/ui/FormField'
import { Input } from '@/components/ui/Input'

describe('FormField', () => {
  it('label ile input\'u birbirine bağlar', () => {
    // 1. Hazırla
    render(<FormField label="E-posta">{(field) => <Input {...field} />}</FormField>)

    // 3. Kontrol et: getByLabelText, label'a tıklanınca odaklanan elemanı bulur.
    // Eleman bulunamazsa test burada hata verir.
    expect(screen.getByLabelText('E-posta')).toBeInTheDocument()
  })

  it('hata mesajını gösterir ve alanı geçersiz olarak işaretler', () => {
    render(
      <FormField label="E-posta" error="Geçerli bir e-posta adresi gir.">
        {(field) => <Input {...field} />}
      </FormField>,
    )

    const input = screen.getByLabelText('E-posta')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    // Ekran okuyucular input'a odaklanınca bu mesajı da okur
    expect(input).toHaveAccessibleDescription('Geçerli bir e-posta adresi gir.')
  })

  it('hata yoksa ipucu metnini gösterir', () => {
    render(
      <FormField label="Şifre" hint="En az 8 karakter">
        {(field) => <Input {...field} />}
      </FormField>,
    )

    expect(screen.getByLabelText('Şifre')).not.toHaveAttribute('aria-invalid')
    expect(screen.getByText('En az 8 karakter')).toBeInTheDocument()
  })
})
