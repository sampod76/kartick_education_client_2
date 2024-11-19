/* eslint-disable @typescript-eslint/ban-ts-comment */
function getChatTimer(timestamp: string | Date | undefined | null) {
  if (!timestamp) {
    return '';
  }
  const now = new Date();
  const date = new Date(timestamp);
  //@ts-ignore
  const secondsAgo = Math.floor((now - date) / 1000);
  const minutesAgo = Math.floor(secondsAgo / 60);
  const hoursAgo = Math.floor(minutesAgo / 60);
  const daysAgo = Math.floor(hoursAgo / 24);
  const yearsAgo = Math.floor(daysAgo / 365);

  if (yearsAgo > 0) {
    return yearsAgo === 1 ? '1 year ago' : `${yearsAgo} years ago`;
  } else if (daysAgo > 0) {
    return daysAgo === 1 ? '1 day ago' : `${daysAgo} days ago`;
  } else if (hoursAgo > 0) {
    return hoursAgo === 1 ? '1 hour ago' : `${hoursAgo} hours ago`;
  } else if (minutesAgo > 0) {
    return minutesAgo === 1 ? '1 minute ago' : `${minutesAgo} minutes ago`;
  } else {
    return 'just now';
  }
}

export default getChatTimer;
