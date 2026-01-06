import {
  ArrowDown,
  ArrowUp,
  Award,
  CheckCircle,
  Hash,
  TrendingUp,
} from "lucide-react";
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

export const SubjectGradeModal = ({
  open = false,
  onOpenChange,
  initialValues = {},
  onSubmit,
  isSubmitting = false,
  mode = "create",
}) => {
  const [formData, setFormData] = useState({
    gradeSeq: 0,
    subjMin: "",
    subjMax: "",
    subjGrade: "",
    subjGpa: "",
    subjResult: "",
    ...initialValues,
  });
  const [originalData, setOriginalData] = useState({});
  const [errors, setErrors] = useState({});

  const hasChanges = useMemo(() => {
    if (mode === "create") return true;

    return (
      parseInt(formData.gradeSeq) !== parseInt(originalData.gradeSeq) ||
      parseFloat(formData.subjMin) !== parseFloat(originalData.subjMin) ||
      parseFloat(formData.subjMax) !== parseFloat(originalData.subjMax) ||
      formData.subjGrade !== originalData.subjGrade ||
      parseFloat(formData.subjGpa) !== parseFloat(originalData.subjGpa) ||
      formData.subjResult !== originalData.subjResult
    );
  }, [formData, originalData, mode]);

  useEffect(() => {
    const resetData = {
      gradeSeq: 0,
      subjMin: "",
      subjMax: "",
      subjGrade: "",
      subjGpa: "",
      subjResult: "",
      ...initialValues,
    };

    setFormData(resetData);
    setOriginalData(resetData);
    setErrors({});
  }, [initialValues, open]);

  const getChangedData = () => {
    if (mode === "create") {
      return {
        ...formData,
        gradeSeq: parseInt(formData.gradeSeq),
      };
    }

    const changes = {};

    if (parseInt(formData.gradeSeq) !== parseInt(originalData.gradeSeq)) {
      changes.gradeSeq = parseInt(formData.gradeSeq);
    }
    if (parseFloat(formData.subjMin) !== parseFloat(originalData.subjMin)) {
      changes.subjMin = formData.subjMin;
    }
    if (parseFloat(formData.subjMax) !== parseFloat(originalData.subjMax)) {
      changes.subjMax = formData.subjMax;
    }
    if (formData.subjGrade !== originalData.subjGrade) {
      changes.subjGrade = formData.subjGrade;
    }
    if (parseFloat(formData.subjGpa) !== parseFloat(originalData.subjGpa)) {
      changes.subjGpa = formData.subjGpa;
    }
    if (formData.subjResult !== originalData.subjResult) {
      changes.subjResult = formData.subjResult;
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

  const validateDecimalField = (value, fieldName) => {
    if (!value || value.trim() === "") {
      return `${fieldName} is required`;
    }

    const num = parseFloat(value);
    if (isNaN(num)) {
      return `${fieldName} must be a valid number`;
    }

    if (num < 0) {
      return `${fieldName} must be a positive number`;
    }

    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.gradeSeq || formData.gradeSeq === 0) {
      newErrors.gradeSeq = "Grade Sequence is required";
    }

    const subjMinError = validateDecimalField(formData.subjMin, "Minimum mark");
    if (subjMinError) {
      newErrors.subjMin = subjMinError;
    }

    const subjMaxError = validateDecimalField(formData.subjMax, "Maximum mark");
    if (subjMaxError) {
      newErrors.subjMax = subjMaxError;
    }

    if (!formData.subjGrade.trim()) {
      newErrors.subjGrade = "Grade is required";
    }

    const subjGpaError = validateDecimalField(formData.subjGpa, "GPA");
    if (subjGpaError) {
      newErrors.subjGpa = subjGpaError;
    } else {
      const gpa = parseFloat(formData.subjGpa);
      if (gpa > 4.0) {
        newErrors.subjGpa = "GPA cannot exceed 4.0";
      }
    }

    if (!formData.subjResult.trim()) {
      newErrors.subjResult = "Result is required";
    }

    if (
      !newErrors.subjMin &&
      !newErrors.subjMax &&
      formData.subjMin &&
      formData.subjMax
    ) {
      const min = parseFloat(formData.subjMin);
      const max = parseFloat(formData.subjMax);
      if (min >= max) {
        newErrors.subjMin = "Minimum mark must be less than maximum mark";
      }
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
            {mode === "create"
              ? "Add a new exam grade configuration"
              : "Update grade information"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
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
            />
            <div className="absolute left-3 top-[46px] text-gray-400 pointer-events-none">
              <Hash className="w-5 h-5" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <InputField
                type="number"
                step="0.01"
                id="subjMin"
                name="subjMin"
                label="Minimum Mark"
                value={formData.subjMin}
                onChange={handleChange}
                placeholder="0.00"
                isRequired
                error={errors.subjMin}
                disabled={isSubmitting}
                inputClassName="pl-10 bg-gray-50"
                decimalPlaces={1}
              />
              <div className="absolute left-3 top-[46px] text-gray-400 pointer-events-none">
                <ArrowDown className="w-5 h-5" />
              </div>
            </div>

            <div className="relative">
              <InputField
                type="number"
                step="0.01"
                id="subjMax"
                name="subjMax"
                label="Maximum Mark"
                value={formData.subjMax}
                onChange={handleChange}
                placeholder="0.00"
                isRequired
                error={errors.subjMax}
                disabled={isSubmitting}
                inputClassName="pl-10 bg-gray-50"
                decimalPlaces={1}
              />
              <div className="absolute left-3 top-[46px] text-gray-400 pointer-events-none">
                <ArrowUp className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="relative">
            <InputField
              id="subjGrade"
              name="subjGrade"
              label="Grade"
              value={formData.subjGrade}
              onChange={handleChange}
              placeholder="Enter grade (e.g., A, B+, C)"
              isRequired
              error={errors.subjGrade}
              disabled={isSubmitting}
              inputClassName="pl-10 bg-gray-50"
            />
            <div className="absolute left-3 top-[46px] text-gray-400 pointer-events-none">
              <Award className="w-5 h-5" />
            </div>
          </div>

          <div className="relative">
            <InputField
              type="number"
              step="0.1"
              id="subjGpa"
              name="subjGpa"
              label="GPA"
              value={formData.subjGpa}
              onChange={handleChange}
              placeholder="0.0"
              isRequired
              error={errors.subjGpa}
              disabled={isSubmitting}
              inputClassName="pl-10 bg-gray-50"
              decimalPlaces={1}
            />
            <div className="absolute left-3 top-[46px] text-gray-400 pointer-events-none">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          <div className="relative">
            <InputField
              id="subjResult"
              name="subjResult"
              label="Result"
              value={formData.subjResult}
              onChange={handleChange}
              placeholder="Enter result (e.g., Pass, Fail, Distinction)"
              isRequired
              error={errors.subjResult}
              disabled={isSubmitting}
              inputClassName="pl-10 bg-gray-50"
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
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="h-10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || (mode === "edit" && !hasChanges)}
              className="h-10 bg-gray-700 text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? mode === "create"
                  ? "Creating..."
                  : "Updating..."
                : mode === "create"
                ? "Create Grade"
                : "Update Grade"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
