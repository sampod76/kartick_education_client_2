/* eslint-disable prettier/prettier */
//----------------------------------------------------------------
export enum ENUM_PAGE_BUILDER_TYPE {
  ProfessionalDevelopment = 'ProfessionalDevelopment',
  Podcast = 'Podcast',
  TheLearningArcTuring = 'TheLearningArcTuring',
  support = 'support',
  privacyPolicy = 'privacyPolicy',
  howToWork = 'howToWork',
  howToRent = 'howToRent',
  adminInfo = 'adminInfo',
}
export const PAGE_TYPE_ARRAY = Object.values(ENUM_PAGE_BUILDER_TYPE);
export type IPageType = keyof typeof ENUM_PAGE_BUILDER_TYPE;
//----------------------------------------------------------------
