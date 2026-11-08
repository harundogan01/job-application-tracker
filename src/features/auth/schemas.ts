import { z } from 'zod'

const email = z
  .string()
  .trim()
  .min(1, 'E-posta adresi gerekli.')
  .pipe(z.email('Geçerli bir e-posta adresi gir.'))

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Şifre gerekli.'),
})

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(2, 'Ad soyad en az 2 karakter olmalı.'),
    email,
    password: z
      .string()
      .min(8, 'Şifre en az 8 karakter olmalı.')
      .regex(/[A-Za-zÇĞİÖŞÜçğıöşü]/, 'Şifre en az bir harf içermeli.')
      .regex(/\d/, 'Şifre en az bir rakam içermeli.'),
    confirmPassword: z.string().min(1, 'Şifreyi tekrar gir.'),
  })
  // Birden fazla alana bağlı kurallar refine ile nesne seviyesinde yazılır.
  // path, hatanın hangi alanın altında gösterileceğini belirler.
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Şifreler eşleşmiyor.',
    path: ['confirmPassword'],
  })

// Şemadan TypeScript tipi türetiliyor: tipi ve doğrulamayı ayrı ayrı yazmaya gerek yok
export type LoginValues = z.infer<typeof loginSchema>
export type RegisterValues = z.infer<typeof registerSchema>
