import { delay } from '@/lib/delay'
import { NotFoundError } from '@/lib/errors'
import { readJson, writeJson } from '@/lib/storage'
import { getLocalSessionUserId } from '@/features/auth/api/localAuthService'
import type { ApplicationService } from '@/features/applications/api/types'
import type { Application, ApplicationInput } from '@/features/applications/types'

/** Her kullanıcının başvuruları ayrı bir anahtarda tutulur */
function storageKey() {
  const userId = getLocalSessionUserId()
  if (!userId) throw new Error('Oturum bulunamadı.')
  return `jat-local-applications:${userId}`
}

function readAll() {
  return readJson<Application[]>(storageKey(), [])
}

function writeAll(applications: Application[]) {
  writeJson(storageKey(), applications)
}

function build(input: ApplicationInput): Application {
  const now = new Date().toISOString()
  return { ...input, id: crypto.randomUUID(), createdAt: now, updatedAt: now }
}

export const localApplicationService: ApplicationService = {
  async list() {
    await delay()
    return readAll()
  },

  async get(id) {
    await delay(150)
    const application = readAll().find((a) => a.id === id)
    if (!application) throw new NotFoundError('Başvuru bulunamadı.')
    return application
  },

  async create(input) {
    await delay()
    const application = build(input)
    writeAll([application, ...readAll()])
    return application
  },

  async update(id, input) {
    await delay()
    const applications = readAll()
    const index = applications.findIndex((a) => a.id === id)
    if (index === -1) throw new NotFoundError('Başvuru bulunamadı.')

    const updated: Application = {
      ...applications[index],
      ...input,
      updatedAt: new Date().toISOString(),
    }
    // Diziyi yerinde değiştirmek yerine yeni bir dizi oluşturuyoruz (immutability)
    writeAll(applications.map((a) => (a.id === id ? updated : a)))
    return updated
  },

  async remove(id) {
    await delay()
    writeAll(readAll().filter((a) => a.id !== id))
  },

  async seed(items) {
    await delay()
    writeAll([...items.map(build), ...readAll()])
  },
}
