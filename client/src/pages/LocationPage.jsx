import { useLocation } from "@/hooks/useLocation";
import PageHeader from "@/components/common/PageHeader";
import { useEffect, useRef, useState } from "react";
import { DataTable } from "@/components/table";
import Delete_modal from "@/components/modals/Delete_modal";
import { LocationModal } from "@/components/location/LocationModal";
import { usePageTitle } from "@/hooks/usePageTitle";
export default function LocationPage() {
  const hasFetchedData = useRef(false);
  usePageTitle("Location");
  const {
    fetchLocation,
    location,
    deletelocation,
    pagination,
    onPageChange,
    onPageSizeChange,
    onSearch,
    isLoading,
    isSubmitting,
    createLocation,
    updateLocation,
    setParams,
  } = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState();
  const [selectedLocation, setselectedLocation] = useState();
  const [initialFormValues, setInitialFormValues] = useState({});

  useEffect(() => {
    if (hasFetchedData.current) return;
    hasFetchedData.current = true;
    const fetchData = async () => {
      await fetchLocation();
    };

    fetchData();
  }, [fetchLocation]);

  const columns = [
    {
      accessorKey: "locationName",
      header: "Location Name",
      cellClassName: "text-left",
    },
  ];

  const openDeleteModal = (data) => {
    setselectedLocation(data);
    setIsModalDeleteOpen(true);
  };

  const handleLocationDelete = async (location) => {
    const result = await deletelocation(location.classLocationId);
    if (result.success) {
      fetchLocation();
    }
    return result.success;
  };

  const handleFormSubmit = async (formData) => {
    let result;
    if (modalMode === "create") {
      result = await createLocation(formData);
    } else {
      result = await updateLocation(formData, selectedLocation.classLocationId);
    }

    if (result.success) {
      setIsModalOpen(false);
      setParams((prev) => ({ ...prev, page: 1 }));
      await fetchLocation({ page: 1 });
    }
    return result.success;
  };

  return (
    <div className='min-h-screen '>
      <PageHeader
        title='Location'
        subtitle='Manage location records'
        primaryAction={{
          label: "Add Location",
          onClick: () => {
            setIsModalOpen(true);
            setModalMode("create");
            setInitialFormValues({});
          },
        }}
        showSearch={true}
        searchPlaceholder='Search by location..'
        onSearch={onSearch}
        searchMaxLength={50}
      />
      <DataTable
        data={location}
        columns={columns}
        idAccessor='classLocationId'
        onEdit={(data) => {
          setselectedLocation(data);
          setInitialFormValues({
            locationId: data.locationId,
            locationName: data.locationName,
          });
          setModalMode("edit");
          setIsModalOpen(true);
        }}
        onDelete={openDeleteModal}
        onPageChange={onPageChange}
        onSizeChange={onPageSizeChange}
        pagination={pagination}
        isLoading={isLoading}
      />
      <LocationModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        initialValues={initialFormValues}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        mode={modalMode}
      />
      {isModalDeleteOpen && selectedLocation && (
        <Delete_modal
          open={isModalDeleteOpen}
          setOpen={setIsModalDeleteOpen}
          onSubmit={handleLocationDelete}
          entityData={selectedLocation}
          title='Delete Schedule'
          confirmationText={`Are you sure you want to delete teacher "${selectedLocation?.locationName}"? This action cannot be undone.`}
        />
      )}
    </div>
  );
}
