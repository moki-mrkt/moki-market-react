export const mapErrorMessage = (serverError) => {
    if (!serverError) return "";

    const message = serverError.includes(': ')
        ? serverError.split(': ')[1]
        : serverError;

    const translations = {

        "name of product should not be empty": "Назва товару не може бути порожньою",

        "name of product must be greater than 2 and less than 64": "Назва має містити від 2 до 64 символів",

        "description of product must be greater than 2 and less than 1000": "Опис має містити від 2 до 1000 символів",

        "Discount must be positive": "Знижка має бути додатною",
        "Discount must be less or equal than 99": "Знижка має бути меншою або дорівнювати 99",

        "manufacturer of product should not be empty": "Вкажіть виробника",
        "manufacturer of product must be greater than 2 and less than 64": "Назва виробника має бути від 2 до 64 символів",

        "subcategory of product should not be empty": "Оберіть підкатегорію",

        "Init of measure should not be empty": "Оберіть одиницю виміру",

        "Value cannot be null": "Введіть значення ваги/об'єму",
        "Value must be positive": "Значення має бути більше 0",
        "Value must be less than 1000": "Значення має бути менше 1000",

        "Can't upload more than 4 files": "Можна завантажити максимум 4 фото",

        "must be greater than or equal to 0": "Ціна не може бути від'ємною",
        "must be less than or equal to 100000": "Ціна занадто висока",
        "must be less than or equal to 99": "Знижка не може бути більше 99%"
    };

    return translations[message] || message;
};