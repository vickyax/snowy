import { appWithTranslation } from "next-i18next";
import { useTranslation } from "next-i18next";

export const useI18n = () => {
  const { t, i18n } = useTranslation("common");

  return {
    t,
    locale: i18n.language,
    changeLocale: (lng: string) => i18n.changeLanguage(lng),
  };
};

export default appWithTranslation;
