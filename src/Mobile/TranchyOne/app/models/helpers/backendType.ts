import { IAnyType, types } from "mobx-state-tree"

export function backendType(type: IAnyType) {
  return types.union(types.null, types.undefined, type)
}
