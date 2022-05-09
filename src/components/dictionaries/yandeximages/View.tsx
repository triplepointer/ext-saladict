import React, { FC } from 'react'
import { VocabularyResult } from './engine'
import { ViewPorps } from '@/components/dictionaries/helpers'
import { StrElm } from '@/components/StrElm'

export const DictVocabulary: FC<ViewPorps<VocabularyResult>> = ({ result }) => (
  <>
    {result.map(el => {
      return <StrElm className="img" html={el.html} />
    })}
  </>
)

export default DictVocabulary
