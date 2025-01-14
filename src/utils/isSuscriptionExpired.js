const isSubscriptionExpired = (date) => {
  const lastDate = new Date(date)
  const currentDate = new Date()

  return lastDate.getFullYear() < currentDate.getFullYear()
}

export default isSubscriptionExpired
