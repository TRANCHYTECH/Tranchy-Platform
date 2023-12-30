import BottomSheet, { BottomSheetProps } from "@gorhom/bottom-sheet"
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types"
import { ComponentType, RefAttributes } from "react"

const BottomSheetBase = BottomSheet as ComponentType<
  BottomSheetProps & RefAttributes<BottomSheetMethods>
>

export { BottomSheetBase, BottomSheet }
