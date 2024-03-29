import { CatLogo } from '../common/components/cat-logo';

export default {
  title: 'Components/CatLogo',
  component: CatLogo,
};

export const Default = {};

export const Small = {
  args: {
    ...Default.args,
    size: 's',
  },
};

export const Large = {
  args: {
    ...Default.args,
    size: 'l',
  },
};

export const Weary = {
  args: {
    ...Default.args,
    catType: 'weary',
  },
};

export const Modal = {
  args: {
    ...Default.args,
    catType: 'modal',
  },
};

export const Tricky = {
  args: {
    ...Default.args,
    catType: 'tricky',
  },
};
