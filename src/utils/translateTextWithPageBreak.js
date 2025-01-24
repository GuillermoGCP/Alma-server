import translateText from './translateText.js'

const translateTextWithPageBreak = async (text) => {
  let fixedText = ''

  const paragraphs = text.split(/\n/)
  const translatedParagraphs = await Promise.all(
    paragraphs.map(async (paragraph) => await translateText(paragraph, 'es-gl'))
  )

  for (let i = 0; i < translatedParagraphs.length; i++) {
    fixedText +=
      i === 0 ? translatedParagraphs[i] : `\n${translatedParagraphs[i]}`
  }

  return fixedText
}

export default translateTextWithPageBreak
