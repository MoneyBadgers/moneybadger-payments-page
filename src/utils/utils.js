export function formatTime(timestamp) {
  const dateTime = new Date(timestamp);

  const hours = String(dateTime.getHours()).padStart(2, '0');
  const minutes = String(dateTime.getMinutes()).padStart(2, '0');

  const day = dateTime.getDate();
  const month = dateTime.toLocaleString('default', { month: 'long' });
  const year = dateTime.getFullYear();

  return `${hours}:${minutes}, ${day} ${month} ${year}`;
}