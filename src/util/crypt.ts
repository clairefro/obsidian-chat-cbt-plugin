import Cryptr from "cryptr";

const PEPPER = [
  "Everything",
  "has",
  "been",
  "thought",
  "of",
  "before,",
  "but",
  "the",
  "problem",
  "is",
  "to",
  "think",
  "of",
  "it",
  "again",
].join("");

const crypt = new Cryptr(PEPPER);

export { crypt };
