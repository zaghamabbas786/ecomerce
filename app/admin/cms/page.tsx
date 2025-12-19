import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getActiveHeroSection, getAllBanners } from '@/actions/cms-actions';
import { HeroSectionForm } from './hero-section-form';
import { BannersList } from './banners-list';

export const metadata = {
  title: 'Homepage CMS',
};

export default async function AdminCMSPage() {
  const [heroResult, bannersResult] = await Promise.all([
    getActiveHeroSection(),
    getAllBanners(),
  ]);

  const hero = 'heroSection' in heroResult ? heroResult.heroSection : null;
  const banners = 'banners' in bannersResult ? bannersResult.banners || [] : [];

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Homepage CMS</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
          </CardHeader>
          <CardContent>
            <HeroSectionForm hero={hero} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Banners</CardTitle>
          </CardHeader>
          <CardContent>
            <BannersList banners={banners} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

