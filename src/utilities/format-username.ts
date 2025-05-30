export function formatUserName(user: {
  firstName?: string
  lastName?: string
  first_name?: string
  last_name?: string
  name?: string
  email: string
}): string {
  // Try different name combinations for compatibility
  const firstName = user.firstName || user.first_name
  const lastName = user.lastName || user.last_name

  if (user.name) {
    return user.name
  }

  if (firstName && lastName) {
    return `${firstName} ${lastName}`
  }

  if (firstName) {
    return firstName
  }

  // Fallback to email username
  return user.email.split('@')[0]
}
