import { getCities } from '@/app/lib/actions/citiesActions'
import { getStates } from '@/app/lib/actions/stateActions'
import Cities from '@/components/citys/Cities'
import React from 'react'

const CityPage = async () => {
    const cities = await getCities()
    const states = await getStates()
  return (
   <div className="space-y-4 min-h-screen relative">
      <Cities cities={cities} states={states}/>
    </div>
  )
}

export default CityPage
