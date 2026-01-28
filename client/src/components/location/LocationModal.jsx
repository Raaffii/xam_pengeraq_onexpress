import { MapPin } from "lucide-react";
import { InputField } from "../common";
import { Button } from "../custom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useEffect, useMemo, useState } from "react";

export const LocationModal = ({
  open = false,
  onOpenChange,
  initialValues = {},
  onSubmit,
  isSubmitting = false,
  mode = "create",
}) => {
  const [formData, setFormData] = useState({
    locationName: "",
    ...initialValues,
  });
  const [originalData, setOriginalData] = useState({});
  const [errors, setErrors] = useState({});

  const hasChanges = useMemo(() => {
    if (mode === "create") return true;

    return formData.locationName !== originalData.locationName;
  }, [formData, originalData, mode]);

  useEffect(() => {
    const resetData = {
      locationName: "",
      ...initialValues,
    };

    setFormData(resetData);
    setOriginalData(resetData);

    setErrors({});
  }, [initialValues, open]);

  const getChangedData = () => {
    if (mode === "create") return formData;

    const changes = {};

    if (formData.locationName !== originalData.locationName) {
      changes.locationName = formData.locationName;
    }
    if (initialValues.classLocationId) {
      changes.classLocationId = initialValues.classLocationId;
    }

    return changes;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.locationName.trim()) {
      newErrors.locationName = "Location name is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const dataToSubmit = getChangedData();
    onSubmit(dataToSubmit);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gray-700">
            {mode === "create" ? "Create New Location" : "Edit Location"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create" ?
              "Add a new location location"
            : "Update location information"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Location Name */}
          <div className="relative">
            <InputField
              id="locationName"
              name="locationName"
              label="Location Name"
              value={formData.locationName}
              onChange={handleChange}
              placeholder="Enter location name"
              isRequired
              error={errors.locationName}
              onError={(error) =>
                setErrors((prev) => ({ ...prev, locationName: error }))
              }
              disabled={isSubmitting}
              inputClassName="pl-10 bg-gray-50"
            />
            <div className="absolute left-3 top-[46px] text-gray-400 pointer-events-none">
              <MapPin className="w-5 h-5" />
            </div>
          </div>

          {mode === "edit" && !hasChanges && (
            <div className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
              No changes detected. Modify the form to enable submission.
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                onOpenChange(false);
              }}
              disabled={isSubmitting}
              className="h-10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || (mode === "edit" && !hasChanges)}
              className="h-10 bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ?
                mode === "create" ?
                  "Creating..."
                : "Updating..."
              : mode === "create" ?
                "Create Location"
              : "Update Location"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
