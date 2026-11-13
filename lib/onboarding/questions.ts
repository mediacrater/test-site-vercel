//lib/onboarding/questions.ts
//
// The onboarding questions: wording, answers and the icon shown on each
// answer. The ORDER they are asked in is in flow.ts.
//
// Adding a question: add it here, add its id to QuestionId and to the branch
// arrays in flow.ts, then raise FLOW_VERSION there. No database change is
// needed (answers are stored as { question id: answer id }).
//
// Ids are what gets saved. They must be lowercase letters, digits and
// underscores (the database refuses anything else), and once real answers
// exist they must never be renamed. Labels can be reworded freely.

import type { LucideIcon } from 'lucide-react';
import {
  Building2,
  Cloud,
  Code,
  Ellipsis,
  Factory,
  FileDown,
  Hammer,
  HeartPulse,
  Network,
  Package,
  Rocket,
  Shirt,
  Signal,
  SignalHigh,
  SignalLow,
  SignalMedium,
  Smartphone,
  Sofa,
  Sparkles,
  Store,
  User,
  UserRound,
  Users,
  UsersRound,
  Utensils,
} from 'lucide-react';

import { ORDERS, ROLES, type QuestionId } from './flow';

export interface AnswerOption {
  /** Saved in the database. */
  value: string;
  label: string;
  /** One line that makes the answer recognisable: who it is for, or examples. */
  example?: string;
  icon: LucideIcon;
}

export interface Question {
  id: QuestionId;
  title: string;
  /** Shown under the title. */
  helper?: string;
  options: AnswerOption[];
}

// Same answers for "per month" (media buyer, business) and "per client per
// month" (agency). The upper end of each range is a plan size: 20, 100, 250
// and 1,000 scans (lib/mediacrater/plans.ts).
const AD_VOLUME: AnswerOption[] = [
  { value: 'up_to_20', label: 'Up to 20', icon: SignalLow },
  { value: '21_100', label: '21 to 100', icon: SignalMedium },
  { value: '101_250', label: '101 to 250', icon: SignalHigh },
  { value: '251_1000', label: '251 to 1,000', icon: Signal },
];

export const QUESTIONS: Record<QuestionId, Question> = {
  role: {
    id: 'role',
    title: 'How will you use Mediacrater?',
    helper: 'Pick the one that fits best. It decides the next questions.',
    options: [
      {
        value: 'media_buyer',
        label: 'Independent media buyer',
        example: 'You run ads for a business as a freelancer or contractor.',
        icon: UserRound,
      },
      {
        value: 'business',
        label: 'Business',
        example: 'You own the business, or work in-house on its ads.',
        icon: Store,
      },
      {
        value: 'agency',
        label: 'Agency',
        example: 'You own or represent an agency that runs ads for clients.',
        icon: Building2,
      },
    ],
  },

  monthly_ads: {
    id: 'monthly_ads',
    title: 'How many new ads do you run per month?',
    helper: 'Count each new video or image you launch. A rough number is fine.',
    options: [...AD_VOLUME, { value: 'over_1000', label: 'More than 1,000', icon: Rocket }],
  },

  product_type: {
    id: 'product_type',
    title: 'What do you advertise the most?',
    options: [
      { value: 'physical_products', label: 'Physical products', example: 'Clothing, supplements, gadgets', icon: Package },
      { value: 'digital_products', label: 'Digital products', example: 'One-time purchases such as PDFs or courses', icon: FileDown },
      { value: 'physical_services', label: 'Physical services', example: 'Construction, cleaning, repairs', icon: Hammer },
      { value: 'digital_services', label: 'Digital services', example: 'SaaS and other subscriptions', icon: Cloud },
      { value: 'other', label: 'Other', icon: Ellipsis },
    ],
  },

  industry: {
    id: 'industry',
    title: 'What industry are you in?',
    options: [
      { value: 'software', label: 'Software', icon: Code },
      { value: 'clothing', label: 'Clothing and fashion', icon: Shirt },
      { value: 'electronics', label: 'Electronics', icon: Smartphone },
      { value: 'beauty', label: 'Beauty and personal care', icon: Sparkles },
      { value: 'health', label: 'Health and wellness', icon: HeartPulse },
      { value: 'food', label: 'Food and drink', icon: Utensils },
      { value: 'home', label: 'Home and garden', icon: Sofa },
      { value: 'other', label: 'Other', icon: Ellipsis },
    ],
  },

  team_size: {
    id: 'team_size',
    title: 'How many people work on your ads?',
    helper: 'Include yourself.',
    options: [
      { value: 'just_me', label: 'Just me', icon: User },
      { value: '2_3', label: '2 to 3', icon: Users },
      { value: '4_5', label: '4 to 5', icon: UsersRound },
      { value: '6_10', label: '6 to 10', icon: Network },
      { value: 'over_10', label: 'More than 10', icon: Factory },
    ],
  },

  client_count: {
    id: 'client_count',
    title: 'How many clients do you run ads for?',
    options: [
      { value: '1_5', label: '1 to 5', icon: User },
      { value: '6_25', label: '6 to 25', icon: Users },
      { value: '26_50', label: '26 to 50', icon: UsersRound },
      { value: 'over_50', label: 'More than 50', icon: Building2 },
    ],
  },

  ads_per_client: {
    id: 'ads_per_client',
    title: 'On average, how many new ads do you run per client each month?',
    helper: 'A rough number is fine.',
    options: AD_VOLUME,
  },
};

export function getOptionLabel(questionId: QuestionId, value: string | undefined): string | null {
  if (!value) return null;
  return QUESTIONS[questionId].options.find((option) => option.value === value)?.label ?? null;
}

export function isValidAnswer(questionId: QuestionId, value: unknown): value is string {
  return typeof value === 'string' && QUESTIONS[questionId].options.some((option) => option.value === value);
}

/** Returns a list of problems with QUESTIONS. Empty means everything is valid. */
export function findQuestionProblems(): string[] {
  const problems: string[] = [];
  const idPattern = /^[a-z0-9_]{1,32}$/;

  for (const [id, question] of Object.entries(QUESTIONS)) {
    if (question.id !== id) problems.push(`Question "${id}": its id field says "${question.id}".`);
    if (!idPattern.test(id)) problems.push(`Question "${id}": the id must be lowercase letters, digits or underscores.`);
    if (question.options.length < 2) problems.push(`Question "${id}": needs at least two answers.`);

    const seen = new Set<string>();
    for (const option of question.options) {
      if (!idPattern.test(option.value)) {
        problems.push(`Question "${id}": answer id "${option.value}" must be lowercase letters, digits or underscores.`);
      }
      if (seen.has(option.value)) problems.push(`Question "${id}": answer id "${option.value}" is used twice.`);
      seen.add(option.value);
    }
  }

  const roleValues = QUESTIONS.role.options.map((option) => option.value).sort().join(',');
  if (roleValues !== [...ROLES].sort().join(',')) {
    problems.push('The answers of the "role" question must be exactly the roles listed in flow.ts.');
  }

  for (const [key, order] of Object.entries(ORDERS)) {
    for (const id of [...order.start, ...ROLES.flatMap((role) => order[role])]) {
      if (!QUESTIONS[id]) problems.push(`Order "${key}" asks "${id}", which is not in QUESTIONS.`);
    }
  }

  return problems;
}

// Same idea as the check in flow.ts: a mistake stops the build.
const questionProblems = findQuestionProblems();
if (questionProblems.length > 0) {
  throw new Error(`lib/onboarding/questions.ts has a problem:\n- ${questionProblems.join('\n- ')}`);
}
