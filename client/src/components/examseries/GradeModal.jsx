import {
  Award,
  BookOpen,
  CheckCircle,
  CreditCard,
  Hash,
  Percent,
} from "lucide-react";
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

export const GradeModal = ({
  open = false,
  onOpenChange,
  initialValues = {},
  onSubmit,
  isSubmitting = false,
  mode = "create",
  examOptions = [],
  optionDisabled = false,
}) => {
  const [formData, setFormData] = useState({
    seriesId: "",
    seriesDesc: "",
    gradeSeq: 0,
    finalPercent: 0,
    grade: "",
    gradePoint: 0,
    gradeResult: 0,
    ...initialValues,
  });
  const [originalData, setOriginalData] = useState({});
  const [errors, setErrors] = useState({});

  const hasChanges = useMemo(() => {
    if (mode === "create") return true;

    return (
      formData.seriesId !== originalData.seriesId ||
      formData.seriesDesc !== originalData.seriesDesc ||
      formData.gradeSeq !== originalData.gradeSeq ||
      formData.finalPercent !== originalData.finalPercent ||
      formData.grade !== originalData.grade ||
      formData.gradePoint !== originalData.gradePoint ||
      formData.gradeResult !== originalData.gradeResult
    );
  }, [formData, originalData, mode]);

  useEffect(() => {
    const resetData = {
      seriesId: "",
      seriesDesc: "",
      gradeSeq: 0,
      finalPercent: 0,
      grade: "",
      gradePoint: 0,
      gradeResult: 0,
      ...initialValues,
    };

    setFormData(resetData);
    setOriginalData(resetData);
    setErrors({});
  }, [initialValues, open]);

  const defaultOption = useMemo(() => {
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
      gradeSeq: parseInt(data.gradeSeq),
    });

    if (mode === "create") return formatData(formData);

    const changes = {};

    if (formData.seriesId !== originalData.seriesId) {
      changes.seriesId = parseInt(formData.seriesId);
      changes.seriesDesc = formData.seriesDesc;
    }
    if (formData.gradeSeq !== originalData.gradeSeq) {
      changes.gradeSeq = parseInt(formData.gradeSeq);
    }
    if (formData.finalPercent !== originalData.finalPercent) {
      changes.finalPercent = formData.finalPercent;
    }
    if (formData.grade !== originalData.grade) {
      changes.grade = formData.grade;
    }
    if (formData.gradePoint !== originalData.gradePoint) {
      changes.gradePoint = formData.gradePoint;
    }
    if (formData.gradeResult !== originalData.gradeResult) {
      changes.gradeResult = formData.gradeResult;
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

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.seriesId) {
      newErrors.seriesId = "Exam Series is required";
    }

    if (!formData.gradeSeq) {
      newErrors.seriesDesc = "Sequence is required";
    }

    if (!formData.finalPercent) {
      newErrors.finalPercent = "Final Percent is required";
    }

    if (!formData.grade) {
      newErrors.grade = "Grade letter is required";
    }

    if (!formData.gradePoint) {
      newErrors.gradePoint = "Grade Point be greater than 0";
    }

    if (!formData.gradeResult) {
      newErrors.gradeResult = "Grade Result is required";
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
            {mode === "create" ? "Create New Grade" : "Edit Grade"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create" ? "Add a new grade" : "Update grade information"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <SearchableDropdown
            id={"seriesId"}
            name={"seriesId"}
            label="Exam Series"
            value={formData.seriesId}
            onChange={handleChange}
            options={examOptions}
            disabled={optionDisabled || isSubmitting}
            error={errors.seriesId}
            isRequired
            placeholder="Select exam series..."
            searchPlaceholder="Search exam series..."
            emptyMessage="No exam series found"
            icon={BookOpen}
            defaultOption={defaultOption}
          />
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <InputField
                type="number"
                id="gradeSeq"
                name="gradeSeq"
                label="Grade Sequence"
                value={formData.gradeSeq}
                onChange={handleChange}
                placeholder="Enter grade sequence"
                isRequired
                error={errors.gradeSeq}
                disabled={isSubmitting}
                inputClassName="pl-10 bg-gray-50"
                maxLength={3}
              />
              <div className="absolute left-3 top-[46px] text-gray-400 pointer-events-none">
                <Hash className="w-5 h-5" />
              </div>
            </div>

            <div className="relative">
              <InputField
                type="number"
                id="finalPercent"
                step="0.01"
                name="finalPercent"
                label="Final Percent"
                value={formData.finalPercent}
                onChange={handleChange}
                placeholder="Grade Percentage (1-100)"
                isRequired
                error={errors.finalPercent}
                onError={(error) =>
                  setErrors((prev) => ({ ...prev, finalPercent: error }))
                }
                disabled={isSubmitting}
                inputClassName="pl-10 bg-gray-50"
                decimalPlaces={2}
                maxLength={10}
                min="0"
              />
              <div className="absolute left-3 top-[46px] text-gray-400 pointer-events-none">
                <Percent className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <InputField
                id="grade"
                name="grade"
                label="Grade"
                value={formData.grade}
                onChange={handleChange}
                placeholder="Enter grade (e.g., A, B+, C)"
                isRequired
                error={errors.grade}
                disabled={isSubmitting}
                inputClassName="pl-10 bg-gray-50"
                maxLength={2}
              />
              <div className="absolute left-3 top-[46px] text-gray-400 pointer-events-none">
                <Award className="w-5 h-5" />
              </div>
            </div>

            <div className="relative">
              <InputField
                id="gradePoint"
                type="number"
                step="0.01"
                name="gradePoint"
                label="Grade Point"
                value={formData.gradePoint}
                onChange={handleChange}
                placeholder="0.00 - 4.00"
                isRequired
                error={errors.gradePoint}
                onError={(error) =>
                  setErrors((prev) => ({ ...prev, gradePoint: error }))
                }
                disabled={isSubmitting}
                inputClassName="pl-10 bg-gray-50"
                decimalPlaces={2}
                maxLength={8}
                min="0"
              />
              <div className="absolute left-3 top-[46px] text-gray-400 pointer-events-none">
                <CreditCard className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="relative">
            <InputField
              id="gradeResult"
              name="gradeResult"
              label="Overral Result"
              value={formData.gradeResult}
              onChange={handleChange}
              placeholder="Enter result (e.g., GAGAL, LULUS, MEMUASKAN)"
              isRequired
              error={errors.gradeResult}
              disabled={isSubmitting}
              inputClassName="pl-10 bg-gray-50"
              maxLength={20}
            />
            <div className="absolute left-3 top-[46px] text-gray-400 pointer-events-none">
              <CheckCircle className="w-5 h-5" />
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
                "Create Grade"
              : "Update Grade"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
