import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/Button'

type ConfirmDialogProps = {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  isLoading?: boolean
  onConfirm: () => void
  onClose: () => void
}

/**
 * Tarayıcının yerel <dialog> elemanını kullanan onay penceresi.
 *
 * <dialog> elemanının showModal()/close() metotları var, yani "open" prop'u
 * ile doğrudan kontrol edilemiyor. Bu, useEffect'in doğru kullanım yerine
 * güzel bir örnek: React state'ini React dışındaki bir sistemle (DOM API'si)
 * senkronize ediyoruz. useRef de DOM elemanına erişmek için kullanılıyor.
 */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Onayla',
  isLoading = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="m-auto w-full max-w-md rounded-xl bg-white p-6 text-gray-900 shadow-xl backdrop:bg-black/40 dark:bg-gray-900 dark:text-gray-100"
    >
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-gray-500">{description}</p>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose} disabled={isLoading}>
          Vazgeç
        </Button>
        <Button variant="danger" onClick={onConfirm} isLoading={isLoading}>
          {confirmLabel}
        </Button>
      </div>
    </dialog>
  )
}
