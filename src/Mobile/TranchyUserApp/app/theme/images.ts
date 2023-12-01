import { SupportLevel } from "app/services/ask-api/models"

// @ts-ignore
import supportLevelCoffee from "../../assets/images/support-level-coffee.png"
// @ts-ignore
import supportLevelExpert from "../../assets/images/support-level-expert.png"
// @ts-ignore
import finishConsultationImage from "../../assets/images/finish-consultation-btn.png"

const getSupportLevelImage = (type: SupportLevel) => {
  switch (type) {
    case SupportLevel.Community:
      return supportLevelCoffee
    case SupportLevel.Expert:
      return supportLevelExpert
    case SupportLevel.Agency:
      return supportLevelCoffee
  }
}
export { getSupportLevelImage, finishConsultationImage }
