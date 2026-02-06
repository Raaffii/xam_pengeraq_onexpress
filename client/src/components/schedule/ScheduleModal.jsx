import {
  Book,
  Calendar,
  Columns2,
  MapPin,
  Repeat,
  Repeat2,
  User,
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
import { useEffect, useMemo, useRef, useState } from "react";
import { useExamSubject } from "@/hooks/useExamSubj";
import { useTeacher } from "@/hooks/useTeacher";
import { useClassLocation } from "@/hooks/useClassLocation";
import { formatDateTimeV2 } from "@/utils";

export const ScheduleModal = ({
  open = false,
  onOpenChange,
  initialValues = {},
  onSubmit,
  isSubmitting = false,
  mode = "create",
  seriesOptions = [],
  isLoadingSeries = false,
}) => {
  const [formData, setFormData] = useState({
    teacherId: "",
    examSeriesId: "",
    examSubjId: "",
    locationId: "",
    startDateTime: "",
    endDateTime: "",
    repeatValue: "",
    repeatFreq: 1,
  });
  const [originalData, setOriginalData] = useState({});
  const [repeatCheck, setRepeatCheck] = useState(false);
  const [errors, setErrors] = useState({});

  const { fetchSubjects, examSubj, isLoading: subjLoad } = useExamSubject();
  const { fetchTeacher, teacher, isLoading: teacherLoad } = useTeacher();
  const {
    fetchClassLocation,
    classLocation,
    isLoading: locationLoad,
  } = useClassLocation();

  const hasFetchedData = useRef(false);

  useEffect(() => {
    if (hasFetchedData.current) return;
    hasFetchedData.current = true;
    const fetchData = async () => {
      await fetchTeacher();
      await fetchClassLocation();
    };

    fetchData();
  }, [fetchTeacher, fetchClassLocation]);

  useEffect(() => {
    if (!open) return;

    const resetData = {
      teacherId: initialValues?.teacherId || "",
      examSeriesId:
        initialValues?.examSeriesId || initialValues?.seriesId || "",
      examSubjId: initialValues?.examSubjId || "",
      locationId: initialValues?.classLocationId || "",
      startDateTime:
        formatDateTimeV2(
          initialValues?.startDateTime,
          "yyyy-MM-dd'T'HH:mm",
          false,
        ) || "",
      endDateTime:
        formatDateTimeV2(initialValues?.endDateTime, "yyyy-MM-dd", false) || "",
      repeatValue: initialValues?.repeatValue || 0,
      repeatFreq: initialValues?.repeatFreq || 1,
    };

    setFormData(resetData);
    setOriginalData(resetData);
    setRepeatCheck(initialValues?.repeatFreq ? true : false);
    setErrors({});
  }, [initialValues, open]);

  useEffect(() => {
    if (formData.examSeriesId && open) {
      fetchSubjects({ bySeries: formData.examSeriesId });
    }
  }, [formData.examSeriesId, open]);

  const hasChanges = useMemo(() => {
    if (mode === "create") return true;

    return (
      formData.teacherId !== originalData.teacherId ||
      formData.examSeriesId !== originalData.examSeriesId ||
      formData.examSubjId !== originalData.examSubjId ||
      formData.locationId !== originalData.locationId ||
      formData.startDateTime !== originalData.startDateTime ||
      formData.endDateTime !== originalData.endDateTime ||
      formData.repeatValue !== originalData.repeatValue ||
      formData.repeatFreq !== originalData.repeatFreq
    );
  }, [formData, originalData, mode]);

  const getChangedData = () => {
    const formatData = (data) => {
      const formatted = {
        teacherId: data.teacherId,
        examSeriesId: data.examSeriesId,
        examSubjId: data.examSubjId,
        locationId: data.locationId,
        startDateTime: data.startDateTime,
        repeatFreq: repeatCheck ? 1 : 0,
      };

      if (repeatCheck) {
        formatted.endDateTime = data.endDateTime;
        formatted.repeatValue = data.repeatValue;
      } else {
        formatted.endDateTime = null;
        formatted.repeatValue = null;
      }

      return formatted;
    };

    if (mode === "create") return formatData(formData);

    const changes = {};

    if (formData.teacherId !== originalData.teacherId) {
      changes.teacherId = formData.teacherId;
    }
    if (formData.examSeriesId !== originalData.examSeriesId) {
      changes.examSeriesId = formData.examSeriesId;
    }
    if (formData.examSubjId !== originalData.examSubjId) {
      changes.examSubjId = formData.examSubjId;
    }
    if (formData.locationId !== originalData.locationId) {
      changes.locationId = formData.locationId;
    }
    if (formData.startDateTime !== originalData.startDateTime) {
      changes.startDateTime = formData.startDateTime;
    }
    if (formData.endDateTime !== originalData.endDateTime) {
      changes.endDateTime = formData.endDateTime;
    }
    if (formData.repeatValue !== originalData.repeatValue) {
      changes.repeatValue = formData.repeatValue || null;
    }

    const newRepeatFreq = repeatCheck ? 1 : 0;
    if (newRepeatFreq !== originalData.repeatFreq) {
      changes.repeatFreq = newRepeatFreq;
    }

    if (initialValues.classschhdid) {
      changes.classSchHdId = initialValues.classschhdid;
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.teacherId) {
      newErrors.teacherId = "Teacher is required";
    }
    if (!formData.examSeriesId) {
      newErrors.examSeriesId = "Exam series is required";
    }
    if (!formData.examSubjId) {
      newErrors.examSubjId = "Exam subject is required";
    }
    if (!formData.locationId) {
      newErrors.locationId = "Location is required";
    }
    if (!formData.startDateTime) {
      newErrors.startDateTime = "Start date and time is required";
    }

    if (repeatCheck) {
      if (!formData.repeatValue) {
        newErrors.repeatValue = "Repeat frequency is required";
      }
      if (!formData.endDateTime) {
        newErrors.endDateTime = "End date is required for recurring schedules";
      }
      if (formData.startDateTime && formData.endDateTime) {
        const startDate = new Date(formData.startDateTime);
        const endDate = new Date(formData.endDateTime);
        if (endDate <= startDate) {
          newErrors.endDateTime = "End date must be after start date";
        }
      }
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const dataToSubmit = getChangedData();
    onSubmit(dataToSubmit);
  };

  const optionsExamSubject = examSubj?.map((item) => ({
    value: item.subjId,
    label: item.subjDesc,
  }));

  const optionsTeacher = teacher?.map((item) => ({
    value: item.teacherId,
    label: item.teacherName,
  }));

  const optionsLocation = classLocation?.map((item) => ({
    value: item.classLocationId,
    label: item.locationName,
  }));

  const optionsRepeat = [
    {
      value: "daily",
      label: "Daily",
    },
    {
      value: "weekly",
      label: "Weekly",
    },
    {
      value: "monthly",
      label: "Monthly",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gray-700">
            {mode === "create" ? "Create New Schedule" : "Edit Schedule"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create" ?
              "Add a new exam schedule"
            : "Update schedule information"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <SearchableDropdown
              id="teacherId"
              name="teacherId"
              label="Teacher"
              value={formData.teacherId}
              onChange={handleChange}
              options={optionsTeacher}
              disabled={isSubmitting}
              isLoading={teacherLoad}
              error={errors.teacherId}
              isRequired
              placeholder="Select teacher..."
              searchPlaceholder="Search teacher..."
              emptyMessage="No teachers found"
              icon={User}
              minSearchLength={0}
              className="h-12"
            />

            <SearchableDropdown
              id="examSeriesId"
              name="examSeriesId"
              label="Exam Series"
              value={formData.examSeriesId}
              onChange={handleChange}
              options={seriesOptions}
              disabled={isSubmitting}
              error={errors.examSeriesId}
              isRequired
              placeholder="Select series..."
              searchPlaceholder="Search series..."
              emptyMessage="No series found"
              icon={Columns2}
              minSearchLength={0}
              className="h-12"
              isLoading={isLoadingSeries}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <SearchableDropdown
              id="examSubjId"
              name="examSubjId"
              label="Exam Subject"
              value={formData.examSubjId}
              onChange={handleChange}
              options={optionsExamSubject}
              disabled={!formData.examSeriesId || isSubmitting}
              error={errors.examSubjId}
              isRequired
              placeholder={
                formData.examSeriesId ? "Select subject..." : (
                  "Select exam series first"
                )
              }
              searchPlaceholder="Search subject..."
              emptyMessage="No subjects found"
              icon={Book}
              minSearchLength={0}
              className="h-12"
              isLoading={subjLoad}
            />

            <SearchableDropdown
              id="locationId"
              name="locationId"
              label="Location"
              value={formData.locationId}
              onChange={handleChange}
              options={optionsLocation}
              disabled={isSubmitting}
              error={errors.locationId}
              isRequired
              placeholder="Select location..."
              searchPlaceholder="Search location..."
              emptyMessage="No locations found"
              icon={MapPin}
              minSearchLength={0}
              className="h-12"
              isLoading={locationLoad}
            />
          </div>

          <div className="relative">
            <InputField
              id="startDateTime"
              type="datetime-local"
              name="startDateTime"
              label={repeatCheck ? "Start Date & Time" : "Schedule Date & Time"}
              value={formData.startDateTime}
              onChange={handleChange}
              isRequired
              error={errors.startDateTime}
              onError={(error) =>
                setErrors((prev) => ({ ...prev, startDateTime: error }))
              }
              disabled={isSubmitting}
              inputClassName="pl-10 bg-gray-50"
            />
            <div className="absolute left-3 top-[46px] text-gray-400 pointer-events-none">
              <Calendar className="w-5 h-5" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <input
                type="checkbox"
                id="repeatSchedule"
                name="repeatSchedule"
                checked={repeatCheck}
                onChange={(e) => {
                  setRepeatCheck(e.target.checked);
                  if (!e.target.checked) {
                    setFormData((prev) => ({
                      ...prev,
                      repeatValue: "",
                      endDateTime: "",
                    }));
                    setErrors((prev) => {
                      const { repeatValue, endDateTime, ...rest } = prev;
                      return rest;
                    });
                  }
                }}
                disabled={isSubmitting}
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div className="flex-1">
                <label
                  htmlFor="repeatSchedule"
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer"
                >
                  <Repeat className="w-4 h-4 text-blue-600" />
                  Repeat Schedule (Optional)
                </label>
                <p className="text-xs text-gray-600 mt-1">
                  Enable this option if you want to create a recurring schedule,
                  such as daily, weekly, or monthly.
                </p>
              </div>
            </div>
          </div>

          {repeatCheck && (
            <div className="grid md:grid-cols-2 gap-4">
              <SearchableDropdown
                id="repeatValue"
                name="repeatValue"
                label="Repeat Frequency"
                value={formData.repeatValue}
                onChange={handleChange}
                options={optionsRepeat}
                disabled={isSubmitting}
                error={errors.repeatValue}
                isRequired
                placeholder="Select frequency..."
                searchPlaceholder="Search frequency..."
                emptyMessage="No frequency options found"
                icon={Repeat2}
                minSearchLength={0}
                className="h-12"
              />

              <div className="relative">
                <InputField
                  id="endDateTime"
                  type="date"
                  name="endDateTime"
                  label="End Date"
                  value={formData.endDateTime}
                  onChange={handleChange}
                  isRequired
                  error={errors.endDateTime}
                  onError={(error) =>
                    setErrors((prev) => ({ ...prev, endDateTime: error }))
                  }
                  disabled={isSubmitting}
                  inputClassName="pl-10 bg-gray-50"
                />
                <div className="absolute left-3 top-[46px] text-gray-400 pointer-events-none">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>
            </div>
          )}

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
              type="submit"
              disabled={isSubmitting || (mode === "edit" && !hasChanges)}
              className="h-10 bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ?
                mode === "create" ?
                  "Creating..."
                : "Updating..."
              : mode === "create" ?
                "Create Schedule"
              : "Update Schedule"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
