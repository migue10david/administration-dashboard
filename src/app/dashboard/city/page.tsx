import { getStates } from '@/app/lib/actions/stateActions'
import React from 'react'

const CityPage = async () => {
    const states = await getStates()
  return (
   <div className="space-y-4 min-h-screen relative">
      <Citys country={countrys}/>
    </div>
  )
}

export default CityPage
