import PropertyDetailContent from '@/components/PropertyDetailContent';

export default async function ForRentDetailPage({ params }) {
  const resolvedParams = await params;
  return (
    <PropertyDetailContent
      propertyId={resolvedParams?.id || 'rent-1'}
      rentOrSale="rent"
    />
  );
}
