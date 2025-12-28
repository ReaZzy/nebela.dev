export const getRandomChar = (): string => {
  return String.fromCharCode(Math.floor(Math.random() * (126 - 33)) + 33);
};
