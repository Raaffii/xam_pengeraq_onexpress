import { BookOpen, User, FileText, Hash, Trash2 } from "lucide-react";
import { InputField, SearchableDropdown, InputRadio } from "../common";
import { Button } from "../custom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useStudentsExamSeries } from "@/hooks/useStudentsExamSeries";
import { useExamSubject } from "@/hooks/useExamSubj";
import { useExamsResult } from "@/hooks/useExamResult";
import Delete_modal from "@/components/modals/Delete_modal";
import { Alert, AlertDescription } from "../ui/alert";

export const ExamResultModal = ({
  open = false,
  onOpenChange,
  initialValues = {},
  onSubmit,
  onSuccessDelete,
  isSubmitting = false,
  mode = "create",
  seriesOptions = [],
  optionDisabled = false,
  lockStudent = false,
}) => {
  const [formData, setFormData] = useState({
    studentId: null,
    studentName: "",
    examSeriesId: null,
    seriesDesc: "",
    examSubjId: null,
    subjDesc: "",
    isRetake: false,
    marks: "",
    subjGpa: "",
    subjGrade: "",
    subjResult: "",
    ...initialValues,
  });
  const [originalData, setOriginalData] = useState({});
  const [errors, setErrors] = useState({});
  const [errorMsg, setErrorMsg] = useState(null);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [studentOptions, setStudentOptions] = useState([]);
  const [gradingTimeout, setGradingTimeout] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const isInitialEditMount = useRef(false);

  const {
    fetchSubjects,
    getGradesBySubjIdAndScore,
    isGrading,
    isLoading: subjLoad,
    error: subjError,
  } = useExamSubject();
  const {
    fetchStudentsExamSeries,
    isLoading: studentLoading,
    error: seriesError,
  } = useStudentsExamSeries();
  const {
    isSubmitting: isDeleting,
    deleteExamResult,
    error: resultError,
  } = useExamsResult();

  const hasChanges = useMemo(() => {
    if (mode === "create") return true;

    return (
      formData.studentId !== originalData.studentId ||
      formData.examSeriesId !== originalData.examSeriesId ||
      formData.examSubjId !== originalData.examSubjId ||
      formData.isRetake !== originalData.isRetake ||
      formData.marks !== originalData.marks ||
      formData.subjGpa !== originalData.subjGpa ||
      formData.subjGrade !== originalData.subjGrade ||
      formData.subjResult !== originalData.subjResult
    );
  }, [formData, originalData, mode]);

  useEffect(() => {
    const resetData = {
      studentId: null,
      studentName: "",
      examSeriesId: null,
      seriesDesc: "",
      examSubjId: null,
      subjDesc: "",
      isRetake: false,
      marks: "",
      subjGpa: "",
      subjGrade: "",
      subjResult: "",
      ...initialValues,
    };

    setFormData(resetData);
    setOriginalData(resetData);
    setErrors({});
    setSubjectOptions([]);
    setStudentOptions([]);

    if (mode === "edit" && open) {
      isInitialEditMount.current = true;
    }
  }, [initialValues, open, mode]);

  useEffect(() => {
    setErrorMsg(resultError || subjError || seriesError);
  }, [resultError, subjError, seriesError]);

  // Fetch subjects when exam series is selected
  useEffect(() => {
    const fetchSubjectsForSeries = async () => {
      if (formData.examSeriesId && fetchSubjects) {
        try {
          const result = await fetchSubjects({
            bySeries: formData.examSeriesId,
          });
          if (result.success && result.data) {
            const options = result.data.map((subject) => ({
              value: subject.subjId,
              label: `(${subject.subjCode}) ${subject.subjDesc}`,
            }));
            setSubjectOptions(options);
          } else {
            setSubjectOptions([]);
          }
        } catch (error) {
          console.error("Error fetching subjects:", error);
          setSubjectOptions([]);
        }
      } else {
        setSubjectOptions([]);
      }
    };

    fetchSubjectsForSeries();
  }, [formData.examSeriesId, fetchSubjects]);

  // Fetch students when exam series is selected (create mode only)
  useEffect(() => {
    const fetchStudentsForSeries = async () => {
      if (
        mode === "create" &&
        !lockStudent &&
        formData.examSeriesId &&
        fetchStudentsExamSeries
      ) {
        try {
          const result = await fetchStudentsExamSeries({
            bySeries: formData.examSeriesId,
          });
          if (result.success && result.data) {
            const options = result.data.map((student) => ({
              value: student.studentId,
              label: student.studentName,
            }));
            setStudentOptions(options);
          } else {
            setStudentOptions([]);
          }
        } catch (error) {
          console.error("Error fetching students:", error);
          setStudentOptions([]);
        }
      } else if (mode === "edit") {
        setStudentOptions([]);
      } else {
        setStudentOptions([]);
      }
    };

    fetchStudentsForSeries();
  }, [mode, formData.examSeriesId, fetchStudentsExamSeries, lockStudent]);

  const fetchGrade = useCallback(
    async (subjId, marks, isRetake) => {
      if (!subjId || !marks || marks <= 0) {
        setFormData((prev) => ({
          ...prev,
          subjGpa: "",
          subjGrade: "",
          subjResult: "",
        }));
        return;
      }

      if (marks > 100) {
        setErrorMsg("Marks must not exceed 100");
        return;
      }

      try {
        const result = await getGradesBySubjIdAndScore(
          subjId,
          parseFloat(marks),
          isRetake,
        );
        if (result.success && result.data) {
          setFormData((prev) => ({
            ...prev,
            subjGpa: result.data.gpa || "",
            subjGrade: result.data.grade || "",
            subjResult: result.data.result || "",
          }));
        }
      } catch (error) {
        console.error("Error fetching grade:", error);
        setFormData((prev) => ({
          ...prev,
          subjGpa: "",
          subjGrade: "",
          subjResult: "",
        }));
      }
    },
    [getGradesBySubjIdAndScore],
  );

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && isInitialEditMount.current) {
      isInitialEditMount.current = false;
      return;
    }

    if (formData.examSubjId && formData.marks && formData.marks > 0) {
      if (gradingTimeout) {
        clearTimeout(gradingTimeout);
      }

      const timeout = setTimeout(() => {
        fetchGrade(formData.examSubjId, formData.marks, formData.isRetake);
      }, 500);

      setGradingTimeout(timeout);

      return () => clearTimeout(timeout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.examSubjId, formData.marks, formData.isRetake, fetchGrade]);

  const defaultSeriesOption = useMemo(() => {
    if (initialValues.examSeriesId && initialValues.seriesDesc) {
      return {
        value: initialValues.examSeriesId,
        label: initialValues.seriesDesc,
      };
    }
    return null;
  }, [initialValues.examSeriesId, initialValues.seriesDesc]);

  const defaultStudentOption = useMemo(() => {
    if (initialValues.studentId && initialValues.studentName) {
      return {
        value: initialValues.studentId,
        label: initialValues.studentName,
      };
    }
    return null;
  }, [initialValues.studentId, initialValues.studentName]);

  const defaultSubjectOption = useMemo(() => {
    if (initialValues.examSubjId && initialValues.subjDesc) {
      return {
        value: initialValues.examSubjId,
        label: initialValues.subjDesc,
      };
    }
    return null;
  }, [initialValues.examSubjId, initialValues.subjDesc]);

  const getChangedData = () => {
    const formatData = (data) => ({
      studentId: parseInt(data.studentId),
      examSeriesId: parseInt(data.examSeriesId),
      examSubjId: parseInt(data.examSubjId),
      isRetake: data.isRetake,
      marks: data.marks,
      subjGpa: data.subjGpa,
      subjGrade: data.subjGrade,
      subjResult: data.subjResult,
    });

    if (mode === "create") return formatData(formData);

    const changes = {};

    if (formData.studentId !== originalData.studentId) {
      changes.studentId = parseInt(formData.studentId);
    }
    if (formData.examSeriesId !== originalData.examSeriesId) {
      changes.examSeriesId = parseInt(formData.examSeriesId);
    }
    if (formData.examSubjId !== originalData.examSubjId) {
      changes.examSubjId = parseInt(formData.examSubjId);
    }
    if (formData.isRetake !== originalData.isRetake) {
      changes.isRetake = String(formData.isRetake);
    }
    if (parseFloat(formData.marks) !== parseFloat(originalData.marks)) {
      changes.marks = formData.marks;
    }
    if (formData.subjGpa !== originalData.subjGpa) {
      changes.subjGpa = formData.subjGpa;
    }
    if (formData.subjGrade !== originalData.subjGrade) {
      changes.subjGrade = formData.subjGrade;
    }
    if (formData.subjResult !== originalData.subjResult) {
      changes.subjResult = formData.subjResult;
    }

    return changes;
  };

  const handleChange = (e) => {
    const { name, value, label } = e.target;

    if (errorMsg) {
      setErrorMsg(null);
    }

    if (name === "examSeriesId" && label !== undefined) {
      setFormData((prev) => ({
        ...prev,
        seriesDesc: label || "",
        examSubjId: null,
        subjDesc: "",
        ...(mode === "create" &&
          !lockStudent && {
            studentId: null,
            studentName: "",
          }),
      }));
    }

    if (name === "studentId" && label !== undefined) {
      setFormData((prev) => ({
        ...prev,
        studentName: label || "",
      }));
    }

    if (name === "examSubjId" && label !== undefined) {
      setFormData((prev) => ({
        ...prev,
        subjDesc: label || "",
      }));
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.studentId) {
      newErrors.studentId = "Student is required";
    }

    if (!formData.examSeriesId) {
      newErrors.examSeriesId = "Exam series is required";
    }

    if (!formData.examSubjId) {
      newErrors.examSubjId = "Subject is required";
    }

    if (!formData.marks || formData.marks < 0 || formData.marks > 100) {
      newErrors.marks = "Marks must be between 0 and 100";
    }

    if (!formData.subjGrade) {
      newErrors.subjGrade = "Grade is required";
    }

    if (!formData.subjGpa) {
      newErrors.subjGpa = "GPA is required";
    }

    if (!formData.subjResult) {
      newErrors.subjResult = "Result is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const dataToSubmit = getChangedData();
    onSubmit(dataToSubmit);
  };

  const handleRetakeChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      isRetake: value === "yes",
    }));
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleExamDelete = async () => {
    const result = await deleteExamResult(formData.resultId);
    if (result.success) {
      setIsDeleteModalOpen(false);
      onOpenChange(false);
      if (onSuccessDelete) {
        onSuccessDelete();
      }
    }
  };

  const retakeOptions = [
    { value: "no", label: "No" },
    { value: "yes", label: "Yes" },
  ];

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-gray-700">
              {mode === "create" ? "Add Student Result" : "Edit Student Result"}
            </DialogTitle>
            <DialogDescription>
              {mode === "create" ?
                "Add a new student exam result"
              : "Update student exam result information"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {errorMsg && (
              <Alert variant="destructive">
                <AlertDescription>{errorMsg}</AlertDescription>
              </Alert>
            )}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Exam Series Dropdown */}
              <SearchableDropdown
                id="examSeriesId"
                name="examSeriesId"
                label="Exam Series"
                value={formData.examSeriesId}
                onChange={handleChange}
                options={seriesOptions}
                disabled={optionDisabled || isSubmitting}
                error={errors.examSeriesId}
                isRequired
                placeholder="Select exam series..."
                searchPlaceholder="Search exam series..."
                emptyMessage="No exam series found"
                icon={BookOpen}
                defaultOption={defaultSeriesOption}
                minSearchLength={0}
                className="h-12"
              />

              {/* Subject Dropdown */}
              <SearchableDropdown
                id="examSubjId"
                name="examSubjId"
                label={"Subject"}
                value={formData.examSubjId}
                onChange={handleChange}
                options={subjectOptions}
                disabled={optionDisabled || isSubmitting || subjLoad}
                error={errors.examSubjId}
                isRequired
                placeholder={
                  subjLoad ? "Loading subjects..." : "Select subject..."
                }
                searchPlaceholder="Search subject..."
                emptyMessage={
                  subjLoad ? "Loading..." : "No subjects found for this series"
                }
                icon={FileText}
                defaultOption={defaultSubjectOption}
                minSearchLength={0}
                className="h-12"
                isLoading={subjLoad}
              />
            </div>

            {/* Student Dropdown */}
            <SearchableDropdown
              id="studentId"
              name="studentId"
              label="Student"
              value={formData.studentId}
              onChange={handleChange}
              options={studentOptions}
              disabled={
                lockStudent ||
                optionDisabled ||
                isSubmitting ||
                (mode === "create" && studentLoading)
              }
              error={errors.studentId}
              isRequired
              placeholder={
                mode === "create" && studentLoading ?
                  "Loading students..."
                : "Select student..."
              }
              searchPlaceholder="Search student..."
              emptyMessage={
                mode === "create" && studentLoading ?
                  "Loading..."
                : "No students found for this series"
              }
              icon={User}
              defaultOption={defaultStudentOption}
              minSearchLength={0}
              className="h-12"
              isLoading={mode === "create" && studentLoading}
            />

            {/* Retake Radio */}
            <InputRadio
              label="Is this a retake?"
              value={formData.isRetake ? "yes" : "no"}
              onChange={handleRetakeChange}
              options={retakeOptions}
              disabled={isSubmitting}
              optionsLayout="horizontal"
            />

            {/* Marks */}
            <div className="relative">
              <InputField
                id="marks"
                type="number"
                name="marks"
                label="Marks"
                value={formData.marks}
                onChange={handleChange}
                placeholder="Enter marks (0-100)"
                isRequired
                error={errors.marks}
                onError={(error) =>
                  setErrors((prev) => ({ ...prev, marks: error }))
                }
                disabled={isSubmitting}
                inputClassName="pl-10 bg-gray-50"
                min="0"
                max="100"
                step="0.01"
                decimalPlaces={2}
                maxLength={5}
              />
              <div className="absolute left-3 top-[46px] text-gray-400 pointer-events-none">
                <Hash className="w-5 h-5" />
              </div>
            </div>

            {isGrading && (
              <div className="text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-lg p-3">
                Calculating grade...
              </div>
            )}

            <div className="grid md:grid-cols-3 gap-4">
              <div className="rounded-lg border-2 bg-primaryblue/10 p-4 text-center border-primaryblue">
                <p className="text-sm text-gray-500">Grade</p>
                <p className="text-3xl font-bold text-primaryblue">
                  {formData?.subjGrade || "-"}
                </p>
              </div>

              <div className="rounded-lg border-2 p-4 text-center">
                <p className="text-sm text-gray-500">GPA</p>
                <p className="sm:text-3xl text-2xl font-bold text-primaryblue">
                  {formData?.subjGpa || "-"}
                </p>
              </div>

              <div className="rounded-lg border-2 p-4 text-center">
                <p className="text-sm text-gray-500">Rank</p>
                <p className="sm:text-xl text-2xl font-bold text-primaryblue">
                  {formData?.subjResult || "-"}
                </p>
              </div>
            </div>

            {mode === "edit" && !hasChanges && (
              <div className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
                No changes detected. Modify the form to enable submission.
              </div>
            )}

            <div className="flex justify-between gap-2 pt-4">
              <div>
                {mode === "edit" && onSuccessDelete && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDeleteClick}
                    disabled={isSubmitting || isDeleting}
                    className="h-10 text-red-600 bg-red-50 hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
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
                  disabled={
                    isSubmitting ||
                    (mode === "edit" && !hasChanges) ||
                    isGrading
                  }
                  className="h-10 bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ?
                    mode === "create" ?
                      "Adding..."
                    : "Updating..."
                  : mode === "create" ?
                    "Add Result"
                  : "Update Result"}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {isDeleteModalOpen && mode === "edit" && (
        <Delete_modal
          open={isDeleteModalOpen}
          setOpen={setIsDeleteModalOpen}
          onSubmit={handleExamDelete}
          entityData={formData}
          title="Delete Exam Result"
          confirmationText={`Are you sure you want to delete "${formData.studentName}" result? This action cannot be undone.`}
        />
      )}
    </>
  );
};
