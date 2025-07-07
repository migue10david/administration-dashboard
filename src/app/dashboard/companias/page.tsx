import Companies from '@/components/compania/Companies'
import { companiasMock } from '@/data/mock-data'
import React from 'react'

const CompaniasPage = () => {



  return (
    <div className="space-y-4">
      <Companies companias={companiasMock} />
      </div>
 )
}

export default CompaniasPage

