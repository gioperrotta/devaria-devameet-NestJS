const chars = '0123456789abcdefghiklmnopqrstuvwxyz';
const size = 12;

export const generateLink = () => {
  let randomString = '';

  for (let i = 0; i < size; i++) {
    if (i === 3 || i === 8) {
      randomString += '-';
    } else {
      const randomNumber = Math.floor(Math.random() * chars.length);
      randomString += chars.substring(randomNumber, randomNumber + 1);
    }
  }

  return randomString;
};
