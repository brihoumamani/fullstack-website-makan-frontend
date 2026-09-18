import PropertyDetailContent from '@/components/PropertyDetailContent';

export default async function ForSaleDetailPage({ params }) {
  const resolvedParams = await params;
  return <PropertyDetailContent propertyId={resolvedParams?.id || '1'} />;
}
