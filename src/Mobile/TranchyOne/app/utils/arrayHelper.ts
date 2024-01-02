export const arrayOrEmptyArray = <T>(data: T[] | null | undefined): T[] =>
  data === undefined || data === null || data.length === 0 ? [] : data
