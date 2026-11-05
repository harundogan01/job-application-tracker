import { useState } from 'react'
import { useForm, useWatch, type FieldErrors, type FieldPath } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useBlocker } from 'react-router'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { FormError } from '@/components/ui/FormError'
import { FormField } from '@/components/ui/FormField'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { FormSteps } from '@/features/applications/components/FormSteps'
import { InterviewFieldsEditor } from '@/features/applications/components/InterviewFieldsEditor'
import {
  CURRENCY_OPTIONS,
  STATUS_OPTIONS,
  WORK_TYPE_OPTIONS,
} from '@/features/applications/constants'
import {
  applicationFormSchema,
  toApplicationInput,
  type ApplicationFormValues,
} from '@/features/applications/schemas'
import type { ApplicationInput } from '@/features/applications/types'
import { getErrorMessage } from '@/lib/errors'

type FieldName = FieldPath<ApplicationFormValues>

/** Her adımda hangi alanların doğrulanacağı */
const STEPS = [
  {
    title: 'İlan bilgileri',
    fields: ['company', 'position', 'location', 'workType', 'jobUrl', 'source'],
  },
  {
    title: 'Süreç ve maaş',
    fields: ['status', 'appliedAt', 'salaryMin', 'salaryMax', 'currency'],
  },
  {
    title: 'Mülakatlar ve notlar',
    fields: ['interviews', 'notes'],
  },
] as const satisfies readonly { title: string; fields: readonly FieldName[] }[]

/** Boş input'u null'a, doluyu sayıya çevirir (maaş alanları için) */
const toNullableNumber = (value: unknown) =>
  value === '' || value == null ? null : Number(value)

function stepsWithErrors(errors: FieldErrors<ApplicationFormValues>) {
  return STEPS.flatMap((step, index) =>
    step.fields.some((field) => field in errors) ? [index] : [],
  )
}

type ApplicationFormProps = {
  defaultValues: ApplicationFormValues
  submitLabel: string
  /** Hata fırlatırsa mesajı formun üstünde gösterilir */
  onSubmit: (input: ApplicationInput) => Promise<void>
  onCancel: () => void
}

export function ApplicationForm({
  defaultValues,
  submitLabel,
  onSubmit,
  onCancel,
}: ApplicationFormProps) {
  const [step, setStep] = useState(0)
  const isLastStep = step === STEPS.length - 1

  const {
    register,
    control,
    handleSubmit,
    trigger,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues,
    // Alan ilk kez terk edildiğinde (blur) doğrula, sonra her değişiklikte
    mode: 'onTouched',
  })

  // useWatch: bir alanın değerine abone olur, değiştikçe bileşen yeniden render olur.
  // Burada "durum" seçimine göre başvuru tarihinin zorunluluğunu gösteriyoruz.
  const status = useWatch({ control, name: 'status' })

  // Kaydedilmemiş değişiklik varken sayfadan çıkılmak istenirse uyar.
  // Gönderim sırasında (isSubmitting) yapılan yönlendirme engellenmez.
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && !isSubmitting && currentLocation.pathname !== nextLocation.pathname,
  )

  const goNext = async () => {
    // Sadece bu adımdaki alanları doğrula; hata yoksa ilerle
    const isValid = await trigger(STEPS[step].fields)
    if (isValid) setStep((s) => s + 1)
  }

  const goToStep = async (target: number) => {
    if (target <= step) return setStep(target)
    // İleriye atlarken aradaki adımları da doğrula
    for (let i = step; i < target; i++) {
      const isValid = await trigger(STEPS[i].fields)
      if (!isValid) return setStep(i)
    }
    setStep(target)
  }

  const submit = handleSubmit(
    async (values) => {
      try {
        await onSubmit(toApplicationInput(values))
      } catch (error) {
        setError('root', { message: getErrorMessage(error) })
      }
    },
    // Doğrulama başarısızsa ilk hatalı adıma git
    (formErrors) => {
      const [firstErrorStep] = stepsWithErrors(formErrors)
      if (firstErrorStep !== undefined) setStep(firstErrorStep)
    },
  )

  return (
    <>
      <form
        noValidate
        onSubmit={(event) => {
          // Son adıma gelmeden Enter'a basılırsa formu göndermek yerine ilerle
          if (!isLastStep) {
            event.preventDefault()
            void goNext()
            return
          }
          void submit(event)
        }}
        className="space-y-6"
      >
        <FormSteps
          steps={STEPS}
          current={step}
          errorSteps={stepsWithErrors(errors)}
          onStepClick={goToStep}
        />

        <Card className="p-5 sm:p-6">
          <FormError message={errors.root?.message} />

          {/*
            Adımları koşullu render etmek ({step === 0 && ...}) yerine "hidden"
            ile gizliyoruz. Böylece tüm input'lar DOM'da ve kayıtlı kalıyor;
            adımlar arasında gidip gelirken hiçbir değer kaybolmuyor.
          */}
          <div hidden={step !== 0} className="grid gap-5 sm:grid-cols-2">
            <FormField label="Şirket" required error={errors.company?.message}>
              {(a11y) => <Input {...a11y} placeholder="Ör. Nova Yazılım" {...register('company')} />}
            </FormField>
            <FormField label="Pozisyon" required error={errors.position?.message}>
              {(a11y) => (
                <Input {...a11y} placeholder="Ör. Frontend Developer" {...register('position')} />
              )}
            </FormField>
            <FormField label="Konum" error={errors.location?.message}>
              {(a11y) => <Input {...a11y} placeholder="Ör. İstanbul" {...register('location')} />}
            </FormField>
            <FormField label="Çalışma şekli" error={errors.workType?.message}>
              {(a11y) => <Select {...a11y} options={WORK_TYPE_OPTIONS} {...register('workType')} />}
            </FormField>
            <FormField label="İlan bağlantısı" error={errors.jobUrl?.message}>
              {(a11y) => (
                <Input {...a11y} type="url" placeholder="https://" {...register('jobUrl')} />
              )}
            </FormField>
            <FormField label="Kaynak" hint="İlanı nerede buldun?" error={errors.source?.message}>
              {(a11y) => (
                <Input {...a11y} placeholder="LinkedIn, referans..." {...register('source')} />
              )}
            </FormField>
          </div>

          <div hidden={step !== 1} className="grid gap-5 sm:grid-cols-2">
            <FormField label="Durum" error={errors.status?.message}>
              {(a11y) => <Select {...a11y} options={STATUS_OPTIONS} {...register('status')} />}
            </FormField>
            <FormField
              label="Başvuru tarihi"
              required={status !== 'wishlist'}
              hint={status === 'wishlist' ? 'Henüz başvurmadıysan boş bırakabilirsin.' : undefined}
              error={errors.appliedAt?.message}
            >
              {(a11y) => <Input {...a11y} type="date" {...register('appliedAt')} />}
            </FormField>
            <FormField label="Maaş (alt sınır)" error={errors.salaryMin?.message}>
              {(a11y) => (
                <Input
                  {...a11y}
                  type="number"
                  min={0}
                  inputMode="numeric"
                  {...register('salaryMin', { setValueAs: toNullableNumber })}
                />
              )}
            </FormField>
            <FormField label="Maaş (üst sınır)" error={errors.salaryMax?.message}>
              {(a11y) => (
                <Input
                  {...a11y}
                  type="number"
                  min={0}
                  inputMode="numeric"
                  {...register('salaryMax', { setValueAs: toNullableNumber })}
                />
              )}
            </FormField>
            <FormField label="Para birimi" error={errors.currency?.message}>
              {(a11y) => <Select {...a11y} options={CURRENCY_OPTIONS} {...register('currency')} />}
            </FormField>
          </div>

          <div hidden={step !== 2} className="space-y-6">
            <InterviewFieldsEditor control={control} register={register} errors={errors} />
            <FormField label="Notlar" error={errors.notes?.message}>
              {(a11y) => (
                <Textarea
                  {...a11y}
                  rows={5}
                  placeholder="Şirket hakkında notlar, sorulacak sorular, izlenimler..."
                  {...register('notes')}
                />
              )}
            </FormField>
          </div>
        </Card>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button variant="ghost" onClick={onCancel}>
            Vazgeç
          </Button>
          <div className="flex gap-2">
            {step > 0 && (
              <Button variant="secondary" onClick={() => setStep((s) => s - 1)}>
                <ArrowLeft className="size-4" aria-hidden /> Geri
              </Button>
            )}
            {isLastStep ? (
              <Button type="submit" isLoading={isSubmitting}>
                {submitLabel}
              </Button>
            ) : (
              <Button type="submit">
                İleri <ArrowRight className="size-4" aria-hidden />
              </Button>
            )}
          </div>
        </div>
      </form>

      <ConfirmDialog
        open={blocker.state === 'blocked'}
        title="Değişiklikler kaydedilmedi"
        description="Sayfadan ayrılırsan girdiğin bilgiler kaybolacak. Devam etmek istiyor musun?"
        confirmLabel="Sayfadan ayrıl"
        onConfirm={() => blocker.proceed?.()}
        onClose={() => blocker.reset?.()}
      />
    </>
  )
}
