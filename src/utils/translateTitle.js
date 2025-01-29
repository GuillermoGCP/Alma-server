import translateText from './translateText.js'

const translateTitle = async (item) => {
  const newItem = {
    ...item,
    title: { es: item.title, gl: await translateText(item.title, 'es-gl') },
  }

  return newItem
}

export default translateTitle
