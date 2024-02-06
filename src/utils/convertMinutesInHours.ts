const converterMinutesInHours = (minutes: number) => {
  const horas = Math.floor(minutes / 60);
  const minutesRemaining = minutes % 60;

  if (horas === 0) {
    return `${minutesRemaining}m`;
  } else if (minutesRemaining === 0) {
    return `${horas}h`;
  } else {
    return `${horas}h ${minutesRemaining}m`;
  }
};

export { converterMinutesInHours };
