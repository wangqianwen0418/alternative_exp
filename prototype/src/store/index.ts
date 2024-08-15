import { atom } from "jotai";
import { TInsight, TCase, TQuestion } from "../util/types";
import { CASES } from "../util/cases";
import { useAtom } from "jotai";

export const freeTextAtom = atom(""); // the free text that users input
export const isSubmittedAtom = atom(false); // whether users have submitted the free text for formatting
export const insightAtom = atom<TInsight>(CASES[0].insight); // the formatted text that users can see

export const pageNameAtom = atom<string>(CASES[0].pageName); // the name of the app, e.g., case 1, case 2, question, free exploration

export const questionIndexAtom = atom<number>(-1); // the index of the question that users are currently answering
export const initVisAtom = atom("bar"); // the initial visualization type that users see
