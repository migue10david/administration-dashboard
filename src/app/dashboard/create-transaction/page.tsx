import { getCompanies } from '@/app/lib/actions/companyActions';
import { getSettings } from '@/app/lib/actions/settingsActions';
import CreateTransactionForm from '@/components/home/CreateTransactionForm'
import React from 'react'

const CreateTransaction = async() => {
  const { data: settings } = await getSettings();
  const { data: companies } = await getCompanies();
    return (
    <div className='pt-6'>
      <CreateTransactionForm companies={companies} settings={settings} />
    </div>
  )
}

export default CreateTransaction
