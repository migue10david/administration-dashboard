import { getSettings } from "@/app/lib/actions/settingsActions";
import { getTransactionTypes } from "@/app/lib/actions/transactionTypeActions";
import CreateCheckForm from "@/components/home/CreateCheckForm";
import React from "react";

const CreateCheckPage = async () => {
  const transactionTypes = await getTransactionTypes();
  const { data: settings } = await getSettings();
  return (
      <CreateCheckForm
        settings={settings}
        transactionTypes={transactionTypes}
      />
  );
};

export default CreateCheckPage;
