import I18n from "i18n-js"

// Note the syntax of these imports from the date-fns library.
// If you import with the syntax: import { format } from "date-fns" the ENTIRE library
// will be included in your production bundle (even if you only use one function).
// This is because react-native does not support tree-shaking.
import { type Locale } from "date-fns"
import format from "date-fns/format"
import isValid from "date-fns/isValid"
import parseISO from "date-fns/parseISO"
import ar from "date-fns/locale/ar-SA"
import ko from "date-fns/locale/ko"
import en from "date-fns/locale/en-US"
import vi from "date-fns/locale/vi"
import formatDistance from "date-fns/formatDistance"

type Options = Parameters<typeof format>[2]

const getLocale = (): Locale => {
  const locale = I18n.currentLocale().split("-")[0]
  return locale === "ar" ? ar : locale === "ko" ? ko : en
}

export const formatDate = (date: string, dateFormat?: string, options?: Options) => {
  const locale = getLocale()
  const dateOptions = {
    ...options,
    locale,
  }
  return format(parseISO(date), dateFormat ?? "MMM dd, yyyy", dateOptions)
}

export const timeAgo = (date?: Date) => {
  // todo (tau): remove this mock
  date = new Date(2024, 0, 1)
  if (date === undefined || !isValid(date)) {
    return ""
  }

  return formatDistance(date, new Date(), { addSuffix: true, locale: vi })
}
