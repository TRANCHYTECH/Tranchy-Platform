export const arrayOrEmpty = <T>(data: T[] | null | undefined): T[] =>
  data === undefined || data === null || data.length === 0 ? [] : data
