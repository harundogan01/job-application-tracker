import { useFieldArray, type Control, type FieldErrors, type UseFormRegister } from 'react-hook-form'
import { CalendarPlus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/ui/FormField'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { INTERVIEW_TYPE_OPTIONS } from '@/features/applications/constants'
import type { ApplicationFormValues } from '@/features/applications/schemas'

type Props = {
  control: Control<ApplicationFormValues>
  register: UseFormRegister<ApplicationFormValues>
  errors: FieldErrors<ApplicationFormValues>
}

/**
 * Dinamik form alanları: kullanıcı istediği kadar mülakat ekleyip silebilir.
 * useFieldArray, dizideki her eleman için alanları yönetir.
 */
export function InterviewFieldsEditor({ control, register, errors }: Props) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'interviews',
    // Varsayılan olarak useFieldArray her satıra "id" adında bir anahtar ekler.
    // Bizim mülakatlarımızın zaten kendi "id" alanı olduğu için
    // çakışmasın diye anahtarın adını değiştiriyoruz.
    keyName: 'key',
  })

  return (
    <div className="space-y-4">
      {fields.length === 0 && (
        <p className="rounded-lg border border-dashed px-4 py-6 text-center text-sm text-gray-500">
          Henüz mülakat eklenmedi. Planlanan ya da tamamlanan görüşmeleri buraya ekleyebilirsin.
        </p>
      )}

      {fields.map((field, index) => {
        const fieldErrors = errors.interviews?.[index]

        return (
          // key olarak index değil, useFieldArray'in ürettiği sabit anahtar kullanılmalı.
          // Index kullanılırsa ortadan bir satır silindiğinde alanlar karışır.
          <fieldset key={field.key} className="rounded-xl border p-4">
            <div className="mb-3 flex items-center justify-between">
              <legend className="text-sm font-semibold">{index + 1}. görüşme</legend>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => remove(index)}
                className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
              >
                <Trash2 className="size-4" aria-hidden /> Kaldır
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Görüşme türü" error={fieldErrors?.type?.message}>
                {(a11y) => (
                  <Select {...a11y} options={INTERVIEW_TYPE_OPTIONS} {...register(`interviews.${index}.type`)} />
                )}
              </FormField>

              <FormField label="Tarih ve saat" required error={fieldErrors?.scheduledAt?.message}>
                {(a11y) => (
                  <Input {...a11y} type="datetime-local" {...register(`interviews.${index}.scheduledAt`)} />
                )}
              </FormField>

              <FormField label="Notlar" className="sm:col-span-2" error={fieldErrors?.notes?.message}>
                {(a11y) => (
                  <Textarea
                    {...a11y}
                    rows={2}
                    placeholder="Kimlerle görüştün, neler soruldu?"
                    {...register(`interviews.${index}.notes`)}
                  />
                )}
              </FormField>
            </div>
          </fieldset>
        )
      })}

      <Button
        variant="secondary"
        onClick={() =>
          append({ id: crypto.randomUUID(), type: 'hr', scheduledAt: '', notes: '' })
        }
      >
        <CalendarPlus className="size-4" aria-hidden /> Görüşme ekle
      </Button>
    </div>
  )
}
