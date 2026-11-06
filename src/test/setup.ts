/**
 * Her test dosyasından önce çalışan ortak kurulum.
 */
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// jest-dom, expect'e DOM'a özel kontroller ekler:
// toBeInTheDocument(), toHaveValue(), toBeDisabled(), toHaveAccessibleDescription()...

afterEach(() => {
  // Her testten sonra render edilen bileşenleri kaldır ve localStorage'ı temizle.
  // Testler birbirinden bağımsız olmalı: bir testin bıraktığı veri diğerini etkilememeli.
  cleanup()
  localStorage.clear()
})

// jsdom'da olmayan tarayıcı API'leri için basit yer tutucular
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }) as unknown as MediaQueryList
}

// jsdom <dialog> elemanının showModal/close metotlarını desteklemiyor
if (!HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function () {
    this.open = true
  }
  HTMLDialogElement.prototype.close = function () {
    this.open = false
    this.dispatchEvent(new Event('close'))
  }
}
