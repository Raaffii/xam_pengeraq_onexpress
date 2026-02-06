import { NotepadText } from "lucide-react";
import { InputField, InputTextArea } from "../common";
import { Button } from "../custom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useEffect, useMemo, useState } from "react";

export const ExamModal = ({
  open = false,
  onOpenChange,
  initialValues = {},
  onSubmit,
  isSubmitting = false,
  mode = "create",
}) => {
  const [formData, setFormData] = useState({
    examName: "",
    examDesc: "",
    ...initialValues,
  });
  const [originalData, setOriginalData] = useState({});
  const [errors, setErrors] = useState({});

  const hasChanges = useMemo(() => {
    if (mode === "create") return true;

    return (
      formData.examName !== originalData.examName ||
      formData.examDesc !== originalData.examDesc
    );
  }, [formData, originalData, mode]);

  useEffect(() => {
    const resetData = {
      examName: "",
      examDesc: "",
      ...initialValues,
    };

    setFormData(resetData);
    setOriginalData(resetData);

    setErrors({});
  }, [initialValues, open]);

  const getChangedData = () => {
    if (mode === "create") return formData;

    const changes = {};

    if (formData.examName !== originalData.examName) {
      changes.examName = formData.examName;
    }
    if (formData.examDesc !== originalData.examDesc) {
      changes.examDesc = formData.examDesc;
    }

    if (initialValues.examId) {
      changes.examId = initialValues.examId;
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

    if (!formData.examName.trim()) {
      newErrors.examName = "Exam Code is required";
    }

    if (!formData.examDesc.trim()) {
      newErrors.examDesc = "Exam Description is required";
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
            {mode === "create" ? "Create New Exam" : "Edit Exam"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create" ?
              "Add a new exam exam"
            : "Update exam information"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Exam Name */}
          <div className="relative">
            <InputField
              id="examName"
              name="examName"
              label="Exam Name"
              value={formData.examName}
              onChange={handleChange}
              placeholder="Enter exam name"
              isRequired
              error={errors.examName}
              onError={(error) =>
                setErrors((prev) => ({ ...prev, examName: error }))
              }
              disabled={isSubmitting}
              inputClassName="pl-10 bg-gray-50"
              maxLength={45}
            />
            <div className="absolute left-3 top-[46px] text-gray-400 pointer-events-none">
              <NotepadText className="w-5 h-5" />
            </div>
          </div>

          {/* Exam Description */}
          <div className="relative">
            <InputTextArea
              id="examDesc"
              type="textarea"
              name="examDesc"
              label="Exam Description"
              value={formData.examDesc}
              onChange={handleChange}
              placeholder="Enter exam description"
              isRequired
              error={errors.examDesc}
              onError={(error) =>
                setErrors((prev) => ({ ...prev, examDesc: error }))
              }
              disabled={isSubmitting}
              maxLength={50}
              showCharCount={true}
            />
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
                "Create Exam"
              : "Update Exam"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
