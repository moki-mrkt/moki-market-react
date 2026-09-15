import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationUk from './locales/uk.json';
import translationRu from './locales/ru.json';

const resources = {
    uk: {
        translation: translationUk
    },
    ru: {
        translation: translationRu
    }
};

i18n
    // Підключаємо визначення мови браузера (зберігатиме вибір у localStorage)
    .use(LanguageDetector)
    // Передаємо інстанс i18n у react-i18next
    .use(initReactI18next)
    // Ініціалізуємо
    .init({
        resources,
        fallbackLng: 'uk', // Мова за замовчуванням, якщо щось піде не так
        debug: false, // Змініть на true, щоб бачити логи в консолі під час розробки

        interpolation: {
            escapeValue: false, // React вже захищає від XSS
        }
    });

export default i18n;