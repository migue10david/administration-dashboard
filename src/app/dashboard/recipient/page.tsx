import { getRecipients } from '@/app/lib/actions/recipientActions'
import Recipients from '@/components/recipient/Recipients'
import { PaginationWithLinks } from '@/components/ui/pagination-with-links'
import React from 'react'

const RecipientPage = async () => {
 const {data, totalPages} = await getRecipients()
  return (
     <div className="space-y-4">
      <Recipients recipients={data} />
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        {/* <PaginationWithLinks
          page={currentPage}
          pageSize={postsPerPage}
          totalCount={totalPages}
        /> */}
      </div>
    </div>
  )
}

export default RecipientPage
