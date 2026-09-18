import PropertyDetailContent from '@/components/PropertyDetailContent';

export default async function DailyRentalDetailPage({ params }) {
  const resolvedParams = await params;
  return (
    <PropertyDetailContent
      propertyId={resolvedParams?.id || 'daily-rent-1'}
      rentOrSale="daily"
    />
  );
}
