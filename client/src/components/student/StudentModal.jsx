import { User, IdCard, BookOpen, X, Plus } from "lucide-react";
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

export const StudentModal = ({
  open = false,
  onOpenChange,
  initialValues = {},
  onSubmit,
  isSubmitting = false,
  mode = "create",
  examSeriesOptions = [],
  isLoadingSeries = false,
}) => {
  const [formData, setFormData] = useState({
    studentName: "",
    studentIdNo: "",
    examSeries: [],
    ...initialValues,
  });
  const [originalData, setOriginalData] = useState({});
  const [errors, setErrors] = useState({});
  const [isAddingMode, setIsAddingMode] = useState(false);

  const hasChanges = useMemo(() => {
    if (mode === "create") return true;

    const examSeriesChanged =
      JSON.stringify(formData.examSeries?.map((s) => s.examSeriesId).sort()) !==
      JSON.stringify(
        originalData.examSeries?.map((s) => s.examSeriesId).sort(),
      );

    return (
      formData.studentName !== originalData.studentName ||
      formData.studentIdNo !== originalData.studentIdNo ||
      examSeriesChanged
    );
  }, [formData, originalData, mode]);

  useEffect(() => {
    const resetData = {
      studentName: "",
      studentIdNo: "",
      examSeries: [],
      ...initialValues,
    };

    setFormData(resetData);
    setOriginalData(resetData);
    setErrors({});
    setIsAddingMode(false);
  }, [initialValues, open]);

  const availableSeriesOptions = useMemo(() => {
    const selectedIds = formData.examSeries?.map((s) => s.examSeriesId) || [];
    return examSeriesOptions.filter(
      (option) => !selectedIds.includes(option.value),
    );
  }, [examSeriesOptions, formData.examSeries]);

  const getChangedData = () => {
    if (mode === "create") {
      return {
        studentName: formData.studentName,
        studentIdNo: formData.studentIdNo,
        examSeries: formData.examSeries.map((s) => s.examSeriesId),
      };
    }

    const changes = {};

    if (formData.studentName !== originalData.studentName) {
      changes.studentName = formData.studentName;
    }
    if (formData.studentIdNo !== originalData.studentIdNo) {
      changes.studentIdNo = formData.studentIdNo;
    }

    const examSeriesChanged =
      JSON.stringify(formData.examSeries?.map((s) => s.examSeriesId).sort()) !==
      JSON.stringify(
        originalData.examSeries?.map((s) => s.examSeriesId).sort(),
      );

    if (examSeriesChanged) {
      changes.examSeries = formData.examSeries.map((s) => s.examSeriesId);
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

  const handleSeriesSelect = (e) => {
    const selectedSeriesId = e.target.value;

    if (!selectedSeriesId) return;

    const selectedOption = examSeriesOptions.find(
      (opt) => opt.value === selectedSeriesId,
    );
    if (!selectedOption) return;

    const newSeries = {
      examSeriesId: selectedOption.value,
      examSeriesDescription: selectedOption.label,
    };

    setFormData((prev) => ({
      ...prev,
      examSeries: [...(prev.examSeries || []), newSeries],
    }));

    if (errors.examSeries) {
      setErrors((prev) => ({ ...prev, examSeries: null }));
    }

    setIsAddingMode(false);
  };

  const handleRemoveSeries = (seriesId) => {
    setFormData((prev) => ({
      ...prev,
      examSeries: prev.examSeries.filter((s) => s.examSeriesId !== seriesId),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.studentName.trim()) {
      newErrors.studentName = "Student Name is required";
    }

    if (!formData.studentIdNo.trim()) {
      newErrors.studentIdNo = "Student ID is required";
    } else if (formData.studentIdNo.length > 4) {
      newErrors.studentIdNo = "Student ID must be 4 characters or less";
    }

    if (!formData.examSeries || formData.examSeries.length === 0) {
      newErrors.examSeries = "At least one Exam Series is required";
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gray-700">
            {mode === "create" ? "Add New Student" : "Edit Student"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create" ?
              "Create a new student record"
            : "Update student information"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Student ID */}
          <div className="relative">
            <InputField
              id="studentIdNo"
              name="studentIdNo"
              label="Student ID"
              value={formData.studentIdNo}
              onChange={handleChange}
              placeholder="Enter student ID (max 4 characters)"
              isRequired
              error={errors.studentIdNo}
              onError={(error) =>
                setErrors((prev) => ({ ...prev, studentIdNo: error }))
              }
              disabled={isSubmitting}
              inputClassName="pl-10 bg-gray-50"
              maxLength={4}
            />
            <div className="absolute left-3 top-[46px] text-gray-400 pointer-events-none">
              <IdCard className="w-5 h-5" />
            </div>
          </div>

          {/* Student Name */}
          <div className="relative">
            <InputField
              id="studentName"
              name="studentName"
              label="Student Name"
              value={formData.studentName}
              onChange={handleChange}
              placeholder="Enter student name"
              isRequired
              error={errors.studentName}
              onError={(error) =>
                setErrors((prev) => ({ ...prev, studentName: error }))
              }
              disabled={isSubmitting}
              inputClassName="pl-10 bg-gray-50"
            />
            <div className="absolute left-3 top-[46px] text-gray-400 pointer-events-none">
              <User className="w-5 h-5" />
            </div>
          </div>

          {/* Exam Series Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Exam Series <span className="text-red-500">*</span>
            </label>

            {/* Selected Series Display */}
            {formData.examSeries && formData.examSeries.length > 0 && (
              <div className="space-y-2 mb-3">
                {/* Series count indicator */}
                <div className="flex items-center justify-between text-xs text-gray-600 pb-1">
                  <span>{formData.examSeries.length} series selected</span>
                  {formData.examSeries.length > 5 && (
                    <span className="text-gray-500">Scroll to view all</span>
                  )}
                </div>

                {/* Scrollable container */}
                <div className="max-h-64 overflow-y-auto pr-2 space-y-2">
                  {formData.examSeries.map((series) => (
                    <div
                      key={series.examSeriesId}
                      className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg group hover:bg-blue-100 transition-colors"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <BookOpen className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <span
                          className="text-sm font-medium text-blue-900 truncate"
                          title={series.examSeriesDescription}
                        >
                          {series.examSeriesDescription}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveSeries(series.examSeriesId)}
                        disabled={isSubmitting}
                        className="h-8 text-red-600 flex-shrink-0 ml-2"
                        title="Remove series"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add New Series */}
            {availableSeriesOptions.length > 0 && (
              <div className="space-y-2">
                {isAddingMode ?
                  <div className="flex gap-2 items-end">
                    <div className="flex-1">
                      <SearchableDropdown
                        id="newExamSeries"
                        name="newExamSeries"
                        value=""
                        onChange={handleSeriesSelect}
                        options={availableSeriesOptions}
                        isLoading={isLoadingSeries}
                        disabled={isSubmitting}
                        placeholder="Select exam series to add..."
                        searchPlaceholder="Search exam series..."
                        emptyMessage="No exam series available"
                        icon={BookOpen}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setIsAddingMode(false)}
                      disabled={isSubmitting}
                      size="sm"
                      className="h-10 text-red-600"
                      title="Cancel adding series"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                : <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsAddingMode(true)}
                    disabled={isSubmitting}
                    className="w-full h-10 border-dashed border-2 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Exam Series
                  </Button>
                }
              </div>
            )}

            {errors.examSeries && (
              <p className="text-sm text-red-500 mt-1">{errors.examSeries}</p>
            )}

            {availableSeriesOptions.length === 0 &&
              formData.examSeries.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  All available exam series have been added
                </p>
              )}
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
                "Add Student"
              : "Update Student"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
