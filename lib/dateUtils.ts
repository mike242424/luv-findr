export function isValidDateString(dateString: string): boolean {
  const datePattern = /^\d{2}\/\d{2}\/\d{4}$/;
  return datePattern.test(dateString);
}

export function formatDateWithLeadingZeros(value: number) {
  return value < 10 ? `0${value}` : value;
}

export function calculateAge(dateOfBirth: string | null) {
  if (!dateOfBirth) return 'N/A';
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
}
