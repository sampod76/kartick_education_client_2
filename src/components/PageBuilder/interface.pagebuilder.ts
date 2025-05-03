//----------------------------------------------------------------
export enum ENUM_PAGE_BUILDER_TYPE {
  aboutUs = 'aboutUs',
  boardOrTrustees = 'boardOrTrustees',
  leaderShip = 'leaderShip',
  staff = 'staff',
  careerOpportunities = 'careerOpportunities',
  academicsProgram = 'academicsProgram',
  inclusionApproach = 'inclusionApproach',
  transitionToHighSchool = 'transitionToHighSchool',
  elibrary = 'elibrary',
  supplementalActivities = 'supplementalActivities',
  theLearningArcTutoring = 'theLearningArcTutoring',
  professionalDevelopment = 'professionalDevelopment',
  podcast = 'podcast',
  theLearningArcTuring = 'theLearningArcTuring',
  support = 'support',
  privacyPolicy = 'privacyPolicy',
  iBLossomLearnLanguageInstitute = 'iBLossomLearnLanguageInstitute',
  iTalkEasiUnlimited = 'iTalkEasiUnlimited',
  privateSchool = 'privateSchool',
  flexAccreditedK12 = 'flexAccreditedK12',
  writingProject = 'writingProject',
  scienceInfinityProject = 'scienceInfinityProject',
  thriveInstitute = 'thriveInstitute',
  wholeChildSeries = 'wholeChildSeries',
  peacefulFamilyDynamics = 'peacefulFamilyDynamics',
}

export const PAGE_TYPE_ARRAY = Object.values(ENUM_PAGE_BUILDER_TYPE);
export type IPageType = keyof typeof ENUM_PAGE_BUILDER_TYPE;
//----------------------------------------------------------------
