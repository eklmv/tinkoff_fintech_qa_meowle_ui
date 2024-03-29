import { GenderIcon } from '../common/components/gender-icon';

export default {
    title: 'Components/GenderIcon',
    component: GenderIcon,
};

export const Male = {
    args: {
        gender: 'male',
    },
};

export const Female = {
    args: {
        gender: 'female',
    },
};

export const Unisex = {
    args: {
        gender: 'unisex',
    },
};
