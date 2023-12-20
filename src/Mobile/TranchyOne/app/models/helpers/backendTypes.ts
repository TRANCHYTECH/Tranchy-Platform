import { IAnyType, ISimpleType, types } from "mobx-state-tree"
import { IsoDate } from "./isoDateType"

function simpleType<T>(type: ISimpleType<T>) {
  return types.union(types.null, types.undefined, type)
}

function anyType(type: IAnyType) {
  return types.union(types.null, types.undefined, type)
}

function arrayType<T>(type: ISimpleType<T>) {
  return types.union(types.null, types.undefined, types.array(type))
}

function enumerationType(type: readonly string[]) {
  return types.union(types.null, types.undefined, types.enumeration(type))
}

function frozenType<T>() {
  return types.union(types.null, types.undefined, types.frozen<T>())
}

function frozenSubType<T>(subType: T) {
  return types.union(types.null, types.undefined, types.frozen(subType))
}

function isoDateType() {
  return types.union(types.null, types.undefined, IsoDate)
}

export const backendTypes = {
  simpleType,
  arrayType,
  enumerationType,
  frozenType,
  frozenSubType,
  isoDateType,
}
