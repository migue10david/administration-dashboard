import { getCountries } from '@/app/lib/actions/countryActions'
import Countrys from '@/components/country/Countrys'
import React from 'react'

const CountryPage = async () => {
    const countrys = await getCountries()
  return (
    <div className="space-y-4 min-h-screen relative">
      <Countrys country={countrys}/>
    </div>
  )
}

export default CountryPage
