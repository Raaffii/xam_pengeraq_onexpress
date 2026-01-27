import { useLocation } from "@/hooks/useLocation";
import PageHeader from "@/components/common/PageHeader";
import { useEffect, useRef, useState } from "react";
import { DataTable } from "@/components/table";
import AddLocation from "@/components/location/AddLocation";
import Delete_modal from "@/components/modals/Delete_modal";
import EditLocation from "@/components/location/EditLocation";

export default function LocationPage() {
  const hasFetchedData = useRef(false);
  const {
    fetchLocation,
    location,
    deletelocation,
    pagination,
    onPageChange,
    onPageSizeChange,
    onSearch,
    isLoading,
  } = useLocation();
  const [isModalOpen, setIsModalOpen] = useState();
  const [isModalEditOpen, setIsModalEditOpen] = useState();
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState();
  const [selectedLocation, setselectedLocation] = useState();

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
      header: <div className='text-left w-full'>Location Name</div>,
      cellClassName: "text-left",
    },
  ];

  const fields = [
    {
      label: "",
      name: "locationId",
      type: "hidden",
    },
    {
      label: "ID",
      name: "studentIdNo",
      type: "text",
      required: true,
      maxLength: 4,
    },
    {
      label: "Name",
      name: "studentName",
      type: "text",
      required: true,
    },
    {
      label: "Exam Series",
      name: "examSeriesId",
      type: "dropdown",
      required: true,
    },
  ];

  const handleTeacherSubmit = () => {
    alert("cek");
  };
  const openEditModal = (teacher) => {
    setselectedLocation(teacher);
    setIsModalEditOpen(true);
  };

  const openDeleteModal = (teacher) => {
    setselectedLocation(teacher);
    setIsModalDeleteOpen(true);
  };

  const handleLocationDelete = async (location) => {
    const result = await deletelocation(location.classLocationId);
    if (result.success) {
      // setParams((prev) => ({ ...prev, page: 1 }));
      fetchLocation();
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
          onClick: () => setIsModalOpen(true),
        }}
        showSearch={true}
        searchPlaceholder='Search by location..'
        onSearch={onSearch}
        searchMaxLength={50}>
        {" "}
      </PageHeader>{" "}
      <DataTable
        data={location}
        columns={columns}
        idAccessor='classLocationId'
        onEdit={openEditModal}
        onDelete={openDeleteModal}
        onPageChange={onPageChange}
        onSizeChange={onPageSizeChange}
        pagination={pagination}
        isLoading={isLoading}
      />
      {isModalOpen && (
        <AddLocation
          open={isModalOpen}
          setOpen={setIsModalOpen}
          onSubmit={handleTeacherSubmit}
          fields={fields}
          title='Add New Location'
          fetchLocation={fetchLocation}
        />
      )}
      {isModalEditOpen && (
        <EditLocation
          open={isModalEditOpen}
          setOpen={setIsModalEditOpen}
          onSubmit={handleTeacherSubmit}
          fields={fields}
          title='Add Edit Location'
          fetchLocation={fetchLocation}
          selectedLocation={selectedLocation}
        />
      )}
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
