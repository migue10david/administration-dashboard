import { getCountries } from "@/app/lib/actions/countryActions";
import { getStates } from "@/app/lib/actions/stateActions";
import States from "@/components/state/States";
import React from "react";

const StatePage = async () => {
  const states = await getStates();
  const countries = await getCountries();
  return (
    <div className="space-y-4 min-h-screen relative">
      <States states={states} countries={countries} />
    </div>
  );
};

export default StatePage;
