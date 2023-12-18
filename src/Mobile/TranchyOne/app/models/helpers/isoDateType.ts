import { types } from "mobx-state-tree"

function validateDate(str: string) {
  const date = Date.parse(str)
  if (isNaN(date)) throw new Error("Invalid date")

  return new Date(date)
}

export const IsoDate = types.custom<string, Date>({
  name: "IsoDate",
  fromSnapshot(value) {
    return validateDate(value)
  },
  toSnapshot(value) {
    return value.toISOString()
  },
  isTargetType(maybeDate) {
    return maybeDate instanceof Date
  },
  getValidationMessage(snapshot) {
    // If we don't throw an error here when the snapshot is faulty (e.g. null),
    // things like types.maybeNull(IsoDate) will not work properly
    try {
      validateDate(snapshot)
      return ""
    } catch (error) {
      return error.message
    }
  },
})
