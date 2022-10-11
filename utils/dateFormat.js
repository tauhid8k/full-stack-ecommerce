import dayjs from 'dayjs';

function formatDate(date) {
  const parseAndFormat = dayjs(date).format('DD MMMM YYYY hh:mm A');
  return parseAndFormat;
}

function addDateHours(date, hours) {
  const parseAndFormat = dayjs(date).add(hours, 'hours').format('hh:mm A');
  return parseAndFormat;
}

export { formatDate, addDateHours };
