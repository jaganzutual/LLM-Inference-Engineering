export function pad(number, size = 3) {
  return String(number).padStart(size, '0');
}

export function cx(...values) {
  return values.filter(Boolean).join(' ');
}

export function pluralize(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}
