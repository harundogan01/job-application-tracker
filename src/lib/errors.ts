/** Yakalanan her türlü hatadan kullanıcıya gösterilebilecek bir mesaj çıkarır */
export function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) return error.message
  return 'Beklenmeyen bir hata oluştu. Lütfen tekrar dene.'
}

/** İstenen kayıt bulunamadığında fırlatılır (ör. silinmiş bir başvurunun linki) */
export class NotFoundError extends Error {
  constructor(message = 'Kayıt bulunamadı.') {
    super(message)
    this.name = 'NotFoundError'
  }
}
