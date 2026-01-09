import { BookOpen, Calendar, CreditCard, FileText } from "lucide-react";
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

export const SeriesModal = ({
  open = false,
  onOpenChange,
  initialValues = {},
  onSubmit,
  isSubmitting = false,
  mode = "create",
  examOptions = [],
}) => {
  const [formData, setFormData] = useState({
    examId: null,
    examName: "",
    seriesDesc: "",
    seriesStartDate: "",
    seriesEndDate: "",
    seriesCredit: 0,
    ...initialValues,
  });
  const [originalData, setOriginalData] = useState({});
  const [errors, setErrors] = useState({});

  const hasChanges = useMemo(() => {
    if (mode === "create") return true;

    return (
      formData.examId !== originalData.examId ||
      formData.seriesDesc !== originalData.seriesDesc ||
      formData.seriesStartDate !== originalData.seriesStartDate ||
      formData.seriesEndDate !== originalData.seriesEndDate ||
      formData.seriesCredit !== originalData.seriesCredit
    );
  }, [formData, originalData, mode]);

  useEffect(() => {
    const resetData = {
      examId: null,
      examName: "",
      seriesDesc: "",
      seriesStartDate: "",
      seriesEndDate: "",
      seriesCredit: 0,
      ...initialValues,
    };

    setFormData(resetData);
    setOriginalData(resetData);
    setErrors({});
  }, [initialValues, open]);

  const defaultExamOption = useMemo(() => {
    if (initialValues.examId && initialValues.examName) {
      return {
        value: initialValues.examId,
        label: initialValues.examName,
      };
    }
    return null;
  }, [initialValues.examId, initialValues.examName]);

  const getChangedData = () => {
    const formatData = (data) => ({
      ...data,
      seriesCredit: parseInt(data.seriesCredit),
    });

    if (mode === "create") return formatData(formData);

    const changes = {};

    if (formData.examId !== originalData.examId) {
      changes.examId = parseInt(formData.examId);
      changes.examName = formData.examName;
    }
    if (formData.seriesDesc !== originalData.seriesDesc) {
      changes.seriesDesc = formData.seriesDesc;
    }
    if (formData.seriesStartDate !== originalData.seriesStartDate) {
      changes.seriesStartDate = formData.seriesStartDate;
    }
    if (formData.seriesEndDate !== originalData.seriesEndDate) {
      changes.seriesEndDate = formData.seriesEndDate;
    }
    if (formData.seriesCredit !== originalData.seriesCredit) {
      changes.seriesCredit = parseInt(formData.seriesCredit);
    }

    if (initialValues.seriesId) {
      changes.seriesId = initialValues.seriesId;
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

  const validateDates = () => {
    if (formData.seriesStartDate && formData.seriesEndDate) {
      const startDate = new Date(formData.seriesStartDate);
      const endDate = new Date(formData.seriesEndDate);

      if (endDate < startDate) {
        return "End date must be after start date";
      }
    }
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.examId) {
      newErrors.examId = "Exam is required";
    }

    if (!formData.seriesDesc.trim()) {
      newErrors.seriesDesc = "Description is required";
    }

    if (!formData.seriesStartDate) {
      newErrors.seriesStartDate = "Start date is required";
    }

    if (!formData.seriesEndDate) {
      newErrors.seriesEndDate = "End date is required";
    }

    const dateError = validateDates();
    if (dateError) {
      newErrors.seriesEndDate = dateError;
    }

    if (!formData.seriesCredit || formData.seriesCredit <= 0) {
      newErrors.seriesCredit = "Credits must be greater than 0";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const dataToSubmit = getChangedData();
    onSubmit(dataToSubmit);
  };

  const handleExamChange = (value, label) => {
    setFormData((prev) => ({
      ...prev,
      examId: value,
      examName: label || "",
    }));
    if (errors.examId) {
      setErrors((prev) => ({ ...prev, examId: null }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gray-700">
            {mode === "create" ? "Create New Exam Series" : "Edit Exam Series"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new exam series"
              : "Update exam series information"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Exam Dropdown */}
          <SearchableDropdown
            label="Exam"
            value={formData.examId}
            onChange={handleExamChange}
            options={examOptions}
            disabled={isSubmitting}
            error={errors.examId}
            isRequired
            placeholder="Select exam..."
            searchPlaceholder="Search exam..."
            emptyMessage="No exams found"
            icon={BookOpen}
            defaultOption={defaultExamOption}
            minSearchLength={0}
            className="h-12"
          />

          {/* Description */}
          <div className="relative">
            <InputField
              id="seriesDesc"
              name="seriesDesc"
              label="Description"
              value={formData.seriesDesc}
              onChange={handleChange}
              placeholder="Enter series description"
              isRequired
              error={errors.seriesDesc}
              onError={(error) =>
                setErrors((prev) => ({ ...prev, seriesDesc: error }))
              }
              disabled={isSubmitting}
              inputClassName="pl-10 bg-gray-50"
            />
            <div className="absolute left-3 top-[46px] text-gray-400 pointer-events-none">
              <FileText className="w-5 h-5" />
            </div>
          </div>

          {/* Start Date */}
          <div className="relative">
            <InputField
              id="seriesStartDate"
              type="date"
              name="seriesStartDate"
              label="Start Date"
              value={formData.seriesStartDate}
              onChange={handleChange}
              isRequired
              error={errors.seriesStartDate}
              onError={(error) =>
                setErrors((prev) => ({ ...prev, seriesStartDate: error }))
              }
              disabled={isSubmitting}
              inputClassName="pl-10 bg-gray-50"
            />
            <div className="absolute left-3 top-[46px] text-gray-400 pointer-events-none">
              <Calendar className="w-5 h-5" />
            </div>
          </div>

          {/* End Date */}
          <div className="relative">
            <InputField
              id="seriesEndDate"
              type="date"
              name="seriesEndDate"
              label="End Date"
              value={formData.seriesEndDate}
              onChange={handleChange}
              isRequired
              error={errors.seriesEndDate}
              onError={(error) =>
                setErrors((prev) => ({ ...prev, seriesEndDate: error }))
              }
              disabled={isSubmitting}
              inputClassName="pl-10 bg-gray-50"
            />
            <div className="absolute left-3 top-[46px] text-gray-400 pointer-events-none">
              <Calendar className="w-5 h-5" />
            </div>
          </div>

          {/* Credits */}
          <div className="relative">
            <InputField
              id="seriesCredit"
              type="number"
              name="seriesCredit"
              label="Credits"
              value={formData.seriesCredit}
              onChange={handleChange}
              placeholder="Enter credits"
              isRequired
              error={errors.seriesCredit}
              onError={(error) =>
                setErrors((prev) => ({ ...prev, seriesCredit: error }))
              }
              disabled={isSubmitting}
              inputClassName="pl-10 bg-gray-50"
              min="0"
            />
            <div className="absolute left-3 top-[46px] text-gray-400 pointer-events-none">
              <CreditCard className="w-5 h-5" />
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
              {isSubmitting
                ? mode === "create"
                  ? "Creating..."
                  : "Updating..."
                : mode === "create"
                ? "Create Series"
                : "Update Series"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
