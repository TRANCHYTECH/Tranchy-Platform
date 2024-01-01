// TODO: write documentation about fonts and typography along with guides on how to add custom fonts in own
// markdown file and add links from here

import { Platform } from "react-native"
import {
  Roboto_300Light as robotoLight,
  Roboto_400Regular as robotoRegular,
  Roboto_500Medium as robotoMedium,
  Roboto_700Bold as robotoSemiBold,
  Roboto_900Black as robotoBold,
} from "@expo-google-fonts/roboto"

export const customFontsToLoad = {
  robotoLight,
  robotoRegular,
  robotoMedium,
  robotoSemiBold,
  robotoBold,
}

const fonts = {
  roboto: {
    // Cross-platform Google font.
    light: "robotoLight",
    normal: "robotoRegular",
    medium: "robotoMedium",
    semiBold: "robotoSemiBold",
    bold: "robotoBold",
  },
  helveticaNeue: {
    // iOS only font.
    thin: "HelveticaNeue-Thin",
    light: "HelveticaNeue-Light",
    normal: "Helvetica Neue",
    medium: "HelveticaNeue-Medium",
  },
  courier: {
    // iOS only font.
    normal: "Courier",
  },
  sansSerif: {
    // Android only font.
    thin: "sans-serif-thin",
    light: "sans-serif-light",
    normal: "sans-serif",
    medium: "sans-serif-medium",
  },
  monospace: {
    // Android only font.
    normal: "monospace",
  },
}

export const typography = {
  /**
   * The fonts are available to use, but prefer using the semantic name.
   */
  fonts,
  /**
   * The primary font. Used in most places.
   */
  primary: fonts.roboto,
  /**
   * An alternate font used for perhaps titles and stuff.
   */
  secondary: Platform.select({ ios: fonts.helveticaNeue, android: fonts.sansSerif }),
  /**
   * Lets get fancy with a monospace font!
   */
  code: Platform.select({ ios: fonts.courier, android: fonts.monospace }),
}
