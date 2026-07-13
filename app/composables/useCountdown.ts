import type { MaybeRefOrGetter } from 'vue'

export interface CountdownParts {
  days: number
  hours: number
  minutes: number
  seconds: number
  finished: boolean
}

/**
 * Live countdown to a target date. Ticks every second on the client;
 * on the server it renders a correct static snapshot for hydration.
 */
export function useCountdown(target: MaybeRefOrGetter<string | Date>) {
  const now = ref(Date.now())

  function compute(): CountdownParts {
    const raw = toValue(target)
    const targetMs = (raw instanceof Date ? raw : new Date(raw)).getTime()
    const diff = Math.max(0, targetMs - now.value)

    const totalSeconds = Math.floor(diff / 1000)
    return {
      days: Math.floor(totalSeconds / 86400),
      hours: Math.floor((totalSeconds % 86400) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
      finished: diff === 0,
    }
  }

  const parts = computed(compute)

  onMounted(() => {
    const id = setInterval(() => {
      now.value = Date.now()
    }, 1000)
    onUnmounted(() => clearInterval(id))
  })

  return parts
}
