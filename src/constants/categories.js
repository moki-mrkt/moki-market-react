import i18n from 'i18next';

export const CATEGORY_CONFIG = {
    'dried-fruits': {
        enum: 'DRIED_FRUITS'
    },
    'nuts': {
        enum: 'NUTS'
    },
    'sweets': {
        enum: 'SWEETS'
    },
    'candies': {
        enum: 'CANDIES'
    },
    'superfoods': {
        enum: 'SUPER_FOOD'
    },
    'oils': {
        enum: 'OIL_AND_BUTTERS'
    },
    'preserves': {
        enum: 'CONSERVATION'
    },
    'tea': {
        enum: 'TEA'
    },
    'coffee': {
        enum: 'COFFEE'
    },
    'snacks': {
        enum: 'SNACKS_AND_CHIPS'
    },
    'spices': {
        enum: 'SPICES'
    }
};

export const getEnumFromSlug = (slug) => {
    return CATEGORY_CONFIG[slug]?.enum || null;
};

export const getLabelFromSlug = (slug) => {
    return CATEGORY_CONFIG[slug] ? i18n.t(`category.${slug}`) : slug;
};

export const getSlugFromEnum = (enumValue) => {
    const foundSlug = Object.keys(CATEGORY_CONFIG).find(
        key => CATEGORY_CONFIG[key].enum === enumValue
    );

    return foundSlug || enumValue?.toLowerCase();
};