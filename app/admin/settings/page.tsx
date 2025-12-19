import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSiteSettings } from '@/actions/cms-actions';
import { SettingsForm } from './settings-form';

export const metadata = {
  title: 'Site Settings',
};

export default async function AdminSettingsPage() {
  const result = await getSiteSettings();
  const settings = result.settings;

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Site Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <SettingsForm settings={settings} />
        </CardContent>
      </Card>
    </div>
  );
}

