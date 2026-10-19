// Central Asset Image Repository for hommlyn247
// All primary category and promotional photography bundled locally in /src/assets/images/

import maidImg from './images/homeelynn_maid_clean_1788855102529.jpg';
import cookImg from './images/homeelynn_cook_chef_1788855127504.jpg';
import electricianImg from './images/homeelynn_electrician_1788855164999.jpg';
import plumberImg from './images/homeelynn_plumber_1788855185949.jpg';
import driverImg from './images/homeelynn_driver_1788855203822.jpg';
import nannyImg from './images/homeelynn_nanny_1788855219011.jpg';
import securityImg from './images/homeelynn_security_1788855237384.jpg';
import deepcleanImg from './images/homeelynn_deepclean_1788855257584.jpg';
import applianceImg from './images/homeelynn_appliance_1788855276790.jpg';
import familyCareImg from './images/homeelynn_family_care_1788855314855.jpg';

export const ASSET_IMAGES = {
  maid: maidImg,
  cook: cookImg,
  electrician: electricianImg,
  plumber: plumberImg,
  driver: driverImg,
  nanny: nannyImg,
  security: securityImg,
  deepclean: deepcleanImg,
  appliance: applianceImg,
  familyCare: familyCareImg,
  logo: '/favicon.ico'
};

export const getCategoryImage = (category: string): string => {
  switch (category?.toLowerCase()) {
    case 'maid':
      return ASSET_IMAGES.maid;
    case 'cook':
      return ASSET_IMAGES.cook;
    case 'electrician':
      return ASSET_IMAGES.electrician;
    case 'plumber':
      return ASSET_IMAGES.plumber;
    case 'driver':
      return ASSET_IMAGES.driver;
    case 'nanny':
      return ASSET_IMAGES.nanny;
    case 'security':
      return ASSET_IMAGES.security;
    case 'deep_clean':
      return ASSET_IMAGES.deepclean;
    case 'appliance':
      return ASSET_IMAGES.appliance;
    default:
      return ASSET_IMAGES.maid;
  }
};

export default ASSET_IMAGES;
