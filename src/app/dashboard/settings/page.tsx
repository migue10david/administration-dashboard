import { getSettings } from "@/app/lib/actions/settingsActions";
import { getCities } from "@/app/lib/actions/citiesActions";
import { getStates } from "@/app/lib/actions/stateActions";
import SettingsComponent from "@/components/settings/SettingsComponent";

const SettingsPage = async () => {
  const settings = await getSettings();
  const { data: cities } = await getCities();
  const { data: states } = await getStates();
  return (
    <SettingsComponent settings={settings} cities={cities} states={states} />
  );
};

export default SettingsPage;
