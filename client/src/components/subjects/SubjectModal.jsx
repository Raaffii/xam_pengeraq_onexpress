import { BookOpen, Dock, Notebook, NotepadText } from "lucide-react";
import { InputField, SearchableDropdown } from "../common";
import { Button } from "../custom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useEffect, useMemo, useState } from "react";

export const SubjectModal = ({
  open = false,
  onOpenChange,
  initialValues = {},
  onSubmit,
  isSubmitting = false,
  mode = "create",
  examSeriesOptions = [],
  isLoadingSeries = false,
  optionDisabled = false,
}) => {
  const [formData, setFormData] = useState({
    subjCode: "",
    subjDesc: "",
    subjCredit: 0,
    seriesId: null,
    seriesDesc: "",
    ...initialValues,
  });
  const [originalData, setOriginalData] = useState({});
  const [errors, setErrors] = useState({});

  const hasChanges = useMemo(() => {
    if (mode === "create") return true;

    return (
      formData.subjCode !== originalData.subjCode ||
      formData.subjDesc !== originalData.subjDesc ||
      formData.subjCredit !== originalData.subjCredit ||
      formData.seriesId !== originalData.seriesId
    );
  }, [formData, originalData, mode]);

  useEffect(() => {
    const resetData = {
      subjCode: "",
      subjDesc: "",
      subjCredit: 0,
      seriesId: null,
      seriesDesc: "",
      ...initialValues,
    };

    setFormData(resetData);
    setOriginalData(resetData);

    setErrors({});
  }, [initialValues, open]);

  const defaultSeriesOption = useMemo(() => {
    if (initialValues.seriesId && initialValues.seriesDesc) {
      return {
        value: initialValues.seriesId,
        label: initialValues.seriesDesc,
      };
    }
    return null;
  }, [initialValues.seriesId, initialValues.seriesDesc]);

  const getChangedData = () => {
    const formatData = (data) => ({
      ...data,
      subjCredit: parseInt(data.subjCredit),
    });

    if (mode === "create") return formatData(formData);

    const changes = {};

    if (formData.subjCode !== originalData.subjCode) {
      changes.subjCode = formData.subjCode;
    }
    if (formData.subjDesc !== originalData.subjDesc) {
      changes.subjDesc = formData.subjDesc;
    }
    if (formData.subjCredit !== originalData.subjCredit) {
      changes.subjCredit = parseInt(formData.subjCredit);
    }
    if (formData.seriesId !== originalData.seriesId) {
      changes.seriesId = formData.seriesId;
      changes.seriesDesc = formData.seriesDesc;
    }

    if (initialValues.subjId) {
      changes.subjId = initialValues.subjId;
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

    if (!formData.subjCode.trim()) {
      newErrors.subjCode = "Subject Code is required";
    }

    if (!formData.subjDesc.trim()) {
      newErrors.subjDesc = "Subject Description is required";
    }

    if (!formData.subjCredit) {
      newErrors.subjCredit = "Subject Credit is required";
    }

    if (!formData.seriesId) {
      newErrors.seriesId = "Exam Series is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const dataToSubmit = getChangedData();
    onSubmit(dataToSubmit);
  };

  const handleSeriesChange = (value, label) => {
    setFormData((prev) => ({
      ...prev,
      seriesId: value,
      seriesDesc: label || "",
    }));
    if (errors.seriesId) {
      setErrors((prev) => ({ ...prev, seriesId: null }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gray-700">
            {mode === "create" ? "Create New Subject" : "Edit Subject"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new exam subject"
              : "Update subject information"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Subject Code */}
          <div className="relative">
            <InputField
              id="subjCode"
              name="subjCode"
              label="Subject Code"
              value={formData.subjCode}
              onChange={handleChange}
              placeholder="Enter subject code"
              isRequired
              error={errors.subjCode}
              onError={(error) =>
                setErrors((prev) => ({ ...prev, subjCode: error }))
              }
              disabled={isSubmitting}
              inputClassName="pl-10 bg-gray-50"
            />
            <div className="absolute left-3 top-[46px] text-gray-400 pointer-events-none">
              <NotepadText className="w-5 h-5" />
            </div>
          </div>

          {/* Subject Description */}
          <div className="relative">
            <InputField
              id="subjDesc"
              name="subjDesc"
              label="Subject Description"
              value={formData.subjDesc}
              onChange={handleChange}
              placeholder="Enter subject Description"
              isRequired
              error={errors.subjDesc}
              onError={(error) =>
                setErrors((prev) => ({ ...prev, subjDesc: error }))
              }
              disabled={isSubmitting}
              inputClassName="pl-10 bg-gray-50"
            />
            <div className="absolute left-3 top-[46px] text-gray-400 pointer-events-none">
              <Notebook className="w-5 h-5" />
            </div>
          </div>

          {/* Subject Credit */}
          <div className="relative">
            <InputField
              id="subjCredit"
              type="number"
              name="subjCredit"
              label="Subject Credit"
              value={formData.subjCredit}
              onChange={handleChange}
              placeholder="Enter Subject Credit"
              isRequired
              error={errors.subjCredit}
              onError={(error) =>
                setErrors((prev) => ({ ...prev, subjCredit: error }))
              }
              disabled={isSubmitting}
              inputClassName="pl-10 bg-gray-50"
            />
            <div className="absolute left-3 top-[46px] text-gray-400 pointer-events-none">
              <Dock className="w-5 h-5" />
            </div>
          </div>

          <SearchableDropdown
            label="Exam Series"
            value={formData.seriesId}
            onChange={handleSeriesChange}
            options={examSeriesOptions}
            isLoading={isLoadingSeries}
            disabled={optionDisabled || isSubmitting}
            error={errors.seriesId}
            isRequired
            placeholder="Select exam series..."
            searchPlaceholder="Search exam series..."
            emptyMessage="No exam series found"
            icon={BookOpen}
            defaultOption={defaultSeriesOption}
          />

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
              {isSubmitting
                ? mode === "create"
                  ? "Creating..."
                  : "Updating..."
                : mode === "create"
                ? "Create Subject"
                : "Update Subject"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
