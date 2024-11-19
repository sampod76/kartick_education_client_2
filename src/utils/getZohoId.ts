export function getLastIdFromZohoMeeting(url: string) {
  // Check if the URL is valid
  const urlPattern = /^https?:\/\/meet\.zoho\.com\/[a-zA-Z0-9]+$/;
  if (!urlPattern.test(url)) {
    return null;
  }

  // Extract the last segment of the URL
  const parts = url.split('/');
  return parts[parts.length - 1];
}
