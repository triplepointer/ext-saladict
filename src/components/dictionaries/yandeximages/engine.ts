import { fetchDirtyDOM } from '@/_helpers/fetch-dom'
import {
  getText,
  handleNoResult,
  handleNetWorkError,
  SearchFunction,
  GetSrcPageFunction,
  DictSearchResult,
  HTMLString,
  getFullLink,
  getInnerHTML,
  getOuterHTML
} from '../helpers'

export const getSrcPage: GetSrcPageFunction = text => {
  return `https://yandex.ru/images/search?text=${text}`
}

export interface VocabularyResultItem {
  html: HTMLString
}

export type VocabularyResult = VocabularyResultItem[];

type VocabularySearchResult = DictSearchResult<VocabularyResult>

export const search: SearchFunction<VocabularyResult> = (
  text,
  config,
  profile,
  payload
) => {
  return fetchDirtyDOM(
    'https://yandex.ru/images/search?text=' +
      encodeURIComponent(text.replace(/\s+/g, ' '))
  )
    .catch(handleNetWorkError)
    .then(handleDOM)
}

const HOST = 'https://yandex.ru'

function handleDOM(
  doc: Document
): VocabularySearchResult | Promise<VocabularySearchResult> {
  const result: VocabularyResult = [];
  const $img = doc.querySelectorAll('.serp-item__thumb');
  
  if($img == null) {
    return handleNoResult();
  }
  
  $img.forEach(img => {
    sanitizeImg(img);
  
    const html = getOuterHTML(HOST, img);
    if (!html) {
      return handleNoResult()
    }
  
    result.push({
      html: html 
    });
  })

  return { result }
}

function sanitizeImg<E extends Element>($image: E): E {
    const $img = document.createElement('img')

    $img.setAttribute('src', getFullLink(HOST, $image, 'src'))

    const attrs = ['width', 'height', 'title']
    for (const attr of attrs) {
      const val = $image.getAttribute(attr)
      if (val) {
        $img.setAttribute(attr, val)
      }
    }

    $image.replaceWith($img)

    return $image
  }