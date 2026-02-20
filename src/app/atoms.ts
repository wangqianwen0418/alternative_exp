import { atom } from 'jotai';

import type { TInsight } from 'lib/types';
import { CASES } from 'research/cases';
import { generateQuestionOrder } from 'research/questions/questionBalance';

/**
 * src/app/atoms
 *
 * Global application state powered by Jotai.
 *
 * Atoms are used to share state between the app shell, charts, tutorial, and
 * response forms without prop-drilling.
 */

export const freeTextAtom = atom(''); // the free text that users input
export const isSubmittedAtom = atom(false); // whether users have submitted the free text (or Question Part 1) for formatting
export const tutorialAtom = atom(true); // whether the user should see the tutorial (only applicable to user study)
export const tutorialOverrideAtom = atom(false);
export const tutorialStep = atom<number>(0); // the tutorial step to display
export const isUserStudyAtom = atom(false);

export const insightAtom = atom<TInsight>(CASES[0].insight); // the formatted text that users can see

export const pageNameAtom = atom<string>(''); // the name of the app, e.g., case 1, case 2, question, free exploration

export const selectedIndicesAtom = atom<number[]>([]);
export const questionIndexAtom = atom<number>(-1); // the index of the question that users are currently answering
export const uuidAtom = atom<string | null>(null); // uuid of user

export const questionOrderAtom = atom<number[]>((get) => {
  const uuid = get(uuidAtom);
  return uuid ? generateQuestionOrder(uuid) : [];
});

export const initVisAtom = atom(); // the initial visualization type that users see
export const secondVisAtom = atom(); // the second visualization that users see during a user study
export const secondGraphTypeAtom = atom<string>(); // the second visualization that users see during a user study
export const isSecondPartAtom = atom(false); // determine if question a or b should be shown
