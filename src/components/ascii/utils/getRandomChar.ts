import { ASCII_PRINTABLE_MIN, ASCII_PRINTABLE_MAX } from "@/components/ascii/constants/constants";

const RANDOM_CHAR_POOL_SIZE = 1000;
const randomCharPool: string[] = [];
let randomCharIndex = 0;

function initRandomCharPool(): void {
  const range = ASCII_PRINTABLE_MAX - ASCII_PRINTABLE_MIN;
  for (let i = 0; i < RANDOM_CHAR_POOL_SIZE; i++) {
    randomCharPool[i] = String.fromCharCode(
      Math.floor(Math.random() * range) + ASCII_PRINTABLE_MIN
    );
  }
}

initRandomCharPool();

export const getRandomChar = (): string => {
  randomCharIndex = (randomCharIndex + 1) % RANDOM_CHAR_POOL_SIZE;
  return randomCharPool[randomCharIndex];
};
