const isSuscriptionExpired = (date) => {
  const lastDate = new Date(date)
  const currentDate = new Date()

  return (
    lastDate.getFullYear() < currentDate.getFullYear() ||
    (lastDate.getFullYear() === currentDate.getFullYear() &&
      lastDate.getMonth() < currentDate.getMonth())
  )
}

export default isSuscriptionExpired
