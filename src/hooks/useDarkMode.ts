import { type UseDarkOptions, useDark } from '@vueuse/core'

export const useDarkMode = (options?: UseDarkOptions) =>
  useDark({
    selector: 'body',
    valueLight: 'light-mode',
    valueDark: 'dark-mode',
    ...options,
  })
