function countDecimalPlaces(number) {
  /*
    Counts the decimal places of a given number.
  */

  let match = (''+number).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
  if (!match) { return 0; }
  return Math.max(
       0,
       // Number of digits right of decimal point.
       (match[1] ? match[1].length : 0)
       // Adjust for scientific notation.
       - (match[2] ? +match[2] : 0));
};

function isInteger(value) {
  if (typeof value == "string") {
    return !isNaN(value) &&
           parseInt(Number(value)) == value &&
           !isNaN(parseInt(value, 10));
  } else {
    Number.isInteger(value);
  }
}

export { countDecimalPlaces, isInteger };
