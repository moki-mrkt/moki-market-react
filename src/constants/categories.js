
export const CATEGORY_CONFIG = {
    'dried_fruits': {
        enum: 'DRIED_FRUITS',
        label: 'Сухофрукти'
    },
    'nuts': {
        enum: 'NUTS',
        label: 'Горіхи'
    },
    'candies': {
        enum: 'CANDIES',
        label: 'Цукерки та солодощі'
    },
    'super_food': {
        enum: 'SUPER_FOOD',
        label: 'Суперфуд'
    },
    'oils': {
        enum: 'OIL_AND_BUTTERS',
        label: 'Олія та масла'
    },
    'conservation': {
        enum: 'CONSERVATION',
        label: 'Консервація'
    },
    'tea': {
        enum: 'TEA',
        label: 'Чай'
    },
    'coffee': {
        enum: 'COFFEE',
        label: 'Кава'
    },
    'snacks': {
        enum: 'SNACKS_AND_CHIPS',
        label: 'Снеки та чіпси'
    },
    'spices': {
        enum: 'SPICES',
        label: 'Спеції'
    }
};

export const getEnumFromSlug = (slug) => {
    return CATEGORY_CONFIG[slug]?.enum || null;
};

export const getLabelFromSlug = (slug) => {
    return CATEGORY_CONFIG[slug]?.label || slug;
};