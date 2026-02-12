import type { IndustrySummary, IndustryTemplate } from './types';
import { buildIndustrySummary } from './utils';
import fashion from './industries/fashion';
import cosmetics from './industries/cosmetics';
import jewelry from './industries/jewelry';
import perfume from './industries/perfume';
import lingerie from './industries/lingerie';
import tech from './industries/tech';
import electronics from './industries/electronics';
import aiAccounts from './industries/ai-accounts';
import gamingAccounts from './industries/gaming-accounts';
import restaurant from './industries/restaurant';
import cafe from './industries/cafe';
import food from './industries/food';
import seafood from './industries/seafood';
import bakery from './industries/bakery';
import healthcare from './industries/healthcare';
import pharmacy from './industries/pharmacy';
import beautySpa from './industries/beauty-spa';
import massage from './industries/massage';
import hairSalon from './industries/hair-salon';
import fitness from './industries/fitness';
import gym from './industries/gym';
import yoga from './industries/yoga';
import vet from './industries/vet';
import homeFurniture from './industries/home-furniture';
import babyCare from './industries/baby-care';
import books from './industries/books';
import stationery from './industries/stationery';
import multiCategory from './industries/multi-category';
import gifts from './industries/gifts';
import handicraft from './industries/handicraft';
import autoParts from './industries/auto-parts';
import auto from './industries/auto';
import appliances from './industries/appliances';
import musicInstruments from './industries/music-instruments';
import travel from './industries/travel';
import hotel from './industries/hotel';
import business from './industries/business';
import manufacturing from './industries/manufacturing';
import construction from './industries/construction';
import realEstate from './industries/real-estate';
import designServices from './industries/design-services';
import courses from './industries/courses';
import affiliateShop from './industries/affiliate-shop';
import environment from './industries/environment';

export const INDUSTRY_TEMPLATES: IndustryTemplate[] = [
  fashion,
  cosmetics,
  jewelry,
  perfume,
  lingerie,
  tech,
  electronics,
  aiAccounts,
  gamingAccounts,
  restaurant,
  cafe,
  food,
  seafood,
  bakery,
  healthcare,
  pharmacy,
  beautySpa,
  massage,
  hairSalon,
  fitness,
  gym,
  yoga,
  vet,
  homeFurniture,
  babyCare,
  books,
  stationery,
  multiCategory,
  gifts,
  handicraft,
  autoParts,
  auto,
  appliances,
  musicInstruments,
  travel,
  hotel,
  business,
  manufacturing,
  construction,
  realEstate,
  designServices,
  courses,
  affiliateShop,
  environment
];

export const INDUSTRY_TEMPLATE_MAP = new Map<string, IndustryTemplate>(
  INDUSTRY_TEMPLATES.map((template) => [template.key, template])
);

export function listIndustries(): IndustrySummary[] {
  return INDUSTRY_TEMPLATES.map(buildIndustrySummary);
}

export function getIndustryTemplate(key?: string | null): IndustryTemplate | null {
  if (!key) {
    return null;
  }
  return INDUSTRY_TEMPLATE_MAP.get(key) ?? null;
}

export * from './types';
export * from './utils';
