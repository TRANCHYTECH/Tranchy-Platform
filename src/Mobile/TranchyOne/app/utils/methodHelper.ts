import { isNil } from "lodash-es"

export const arrayOrEmptyArray = <T>(data: T[] | null | undefined): T[] =>
  data === undefined || data === null || data.length === 0 ? [] : data

export const parseNumber = (value: string | null | undefined): number | undefined => {
  return isNil(value) ? undefined : parseInt(value)
}
