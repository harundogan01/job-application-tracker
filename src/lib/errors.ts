/** Yakalanan her türlü hatadan kullanıcıya gösterilebilecek bir mesaj çıkarır */
export function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) return error.message
  return 'Beklenmeyen bir hata oluştu. Lütfen tekrar dene.'
}
