//lib/onboarding/flow.ts
//
// The ORDER of the onboarding questions. Nothing else lives here: the wording,
// answers and icons are in questions.ts.
//
// To change the order: move ids inside the arrays below. That is the whole
// change. To test two orders against each other, keep both in ORDERS and list
// both in ACTIVE_ORDER_KEYS; each account is given one of them once and keeps
// it (it is saved on their row as order_variant).
//
// One rule: "role" is asked first. Every other question belongs to one role's
// branch, so the app cannot know which questions to show before it. The check
// at the bottom of this file stops the build if an order breaks that rule.

export type Role = 'media_buyer' | 'business' | 'agency';

export type QuestionId =
  | 'role'
  | 'monthly_ads'
  | 'product_type'
  | 'industry'
  | 'team_size'
  | 'client_count'
  | 'ads_per_client';

// The screen after the last question. Not a question, not counted in "2 of 3".
export const PLAN_STEP = 'plan';
export type StepId = QuestionId | typeof PLAN_STEP;

// Raise this when questions or answers are added or removed, so old and new
// rows can be told apart. Never rename an existing question id or answer id:
// that silently splits the data in two.
export const FLOW_VERSION = 1;

export type Order = { start: QuestionId[] } & Record<Role, QuestionId[]>;

export const ROLES: Role[] = ['media_buyer', 'business', 'agency'];

export const ORDERS: Record<string, Order> = {
  a: {
    start: ['role'],
    media_buyer: ['monthly_ads', 'product_type'],
    business: ['industry', 'team_size', 'monthly_ads'],
    agency: ['client_count', 'ads_per_client'],
  },
  b: {
    start: ['role'],
    media_buyer: ['product_type', 'monthly_ads'],
    business: ['monthly_ads', 'industry', 'team_size'],
    agency: ['ads_per_client', 'client_count'],
  },
};

// Orders handed out to new accounts, split evenly. Use ['a'] to stop testing.
// An order must stay in ORDERS for as long as any row still refers to it.
export const ACTIVE_ORDER_KEYS: string[] = ['a', 'b'];

export const DEFAULT_ORDER_KEY = 'a';

export function isRole(value: unknown): value is Role {
  return typeof value === 'string' && (ROLES as string[]).includes(value);
}

/** The order saved on a row, or the default if that order no longer exists. */
export function getOrder(key: string | null | undefined): Order {
  return (key && ORDERS[key]) || ORDERS[DEFAULT_ORDER_KEY];
}

/** The question screens this person will see, in order. Grows once the role is known. */
export function resolveSteps(order: Order, role: Role | null): QuestionId[] {
  return role ? [...order.start, ...order[role]] : [...order.start];
}

/**
 * How many question screens to show in "Question 1 of N" before the role is
 * known: the shortest branch, so the number can only go up (3 becomes 4 for a
 * business), never down.
 */
export function minimumTotal(order: Order): number {
  return order.start.length + Math.min(...ROLES.map((role) => order[role].length));
}

/**
 * Which order an account gets. Worked out from the account id, so the same
 * person gets the same answer on every device, with no random number involved.
 * (FNV-1a hash. It only spreads accounts evenly; it protects nothing.)
 */
export function pickOrderKey(userId: string): string {
  const keys = ACTIVE_ORDER_KEYS.filter((key) => ORDERS[key]);
  if (keys.length === 0) return DEFAULT_ORDER_KEY;

  let hash = 0x811c9dc5;
  for (let i = 0; i < userId.length; i++) {
    hash ^= userId.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return keys[(hash >>> 0) % keys.length];
}

/** Returns a list of problems with ORDERS. Empty means every order is valid. */
export function findOrderProblems(orders: Record<string, Order> = ORDERS): string[] {
  const problems: string[] = [];
  const idPattern = /^[a-z0-9_]{1,16}$/;

  for (const [key, order] of Object.entries(orders)) {
    if (!idPattern.test(key)) {
      problems.push(`Order "${key}": the name must be 1 to 16 lowercase letters, digits or underscores.`);
    }
    if (order.start[0] !== 'role') {
      problems.push(`Order "${key}": "role" must be the first question.`);
    }
    if (order.start.length !== 1) {
      problems.push(`Order "${key}": only "role" can come before the branches.`);
    }
    for (const role of ROLES) {
      const branch = order[role];
      if (!branch || branch.length === 0) {
        problems.push(`Order "${key}": the ${role} branch has no questions.`);
        continue;
      }
      if (branch.includes('role')) {
        problems.push(`Order "${key}": "role" cannot be asked again inside the ${role} branch.`);
      }
      if (new Set(branch).size !== branch.length) {
        problems.push(`Order "${key}": the ${role} branch asks a question twice.`);
      }
    }
  }

  for (const key of ACTIVE_ORDER_KEYS) {
    if (!orders[key]) problems.push(`ACTIVE_ORDER_KEYS lists "${key}", which is not in ORDERS.`);
  }
  if (!orders[DEFAULT_ORDER_KEY]) {
    problems.push(`DEFAULT_ORDER_KEY "${DEFAULT_ORDER_KEY}" is not in ORDERS.`);
  }

  return problems;
}

// Runs when the site is built (and on every page load in development). A
// mistake in ORDERS stops the build with a readable message instead of
// reaching a customer.
const orderProblems = findOrderProblems();
if (orderProblems.length > 0) {
  throw new Error(`lib/onboarding/flow.ts has an invalid question order:\n- ${orderProblems.join('\n- ')}`);
}
