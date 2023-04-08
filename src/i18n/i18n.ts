import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import HOME_EN from 'src/locales/en/home.json'
import HEADER_EN from 'src/locales/en/header.json'
import PRODUCT_EN from 'src/locales/en/product.json'
import CART_EN from 'src/locales/en/cart.json'
import PROFILE_EN from 'src/locales/en/profile.json'
import HOME_VI from 'src/locales/vi/home.json'
import HEADER_VI from 'src/locales/vi/header.json'
import PRODUCT_VI from 'src/locales/vi/product.json'
import CART_VI from 'src/locales/vi/cart.json'
import PROFILE_VI from 'src/locales/vi/profile.json'

export const locales = {
  en: 'English',
  vi: 'Tiếng Việt'
}
const resources = {
  en: {
    home: HOME_EN,
    header: HEADER_EN,
    product: PRODUCT_EN,
    cart: CART_EN,
    profile: PROFILE_EN
  },
  vi: {
    home: HOME_VI,
    header: HEADER_VI,
    product: PRODUCT_VI,
    cart: CART_VI,
    profile: PROFILE_VI
  }
}
const defaultNS = 'home'
i18n.use(initReactI18next).init({
  resources,
  lng: 'vi',
  ns: ['home', 'header', 'product', 'cart', 'profile'],
  fallbackLng: 'vi',
  defaultNS,
  interpolation: {
    escapeValue: false // react already safes from xss
  }
})
