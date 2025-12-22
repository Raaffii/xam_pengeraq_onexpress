import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const InputField = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  isRequired = false,
  error,
  onError,
  disabled = false,
  readOnly = false,
  maxLength = 50,
  className = "",
  labelClassName = "",
  inputClassName = "",
  dir,
  validate,
  name,
  ...props
}) => {
  const handleChange = (e) => {
    let newValue = e.target.value;

    if (type === "number") {
      newValue = newValue.replace(/\D/g, "");

      if (maxLength && newValue.length > maxLength) {
        newValue = newValue.slice(0, maxLength);
      }

      if (error && onError) onError(null);

      // if (validate) {
      //   const validationError = validate(newValue);
      //   if (validationError && onError) onError(validationError);
      // }

      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: newValue,
          name: name || e.target.name,
        },
      };

      onChange?.(syntheticEvent);
      return;
    }

    if (error && onError) onError(null);

    // if (validate) {
    //   const validationError = validate(newValue);
    //   if (validationError && onError) onError(validationError);
    // }

    onChange?.(e);
  };

  const handleBlur = (e) => {
    const newValue = e.target.value;

    if (isRequired && !newValue.trim() && onError) {
      onError(`${label} is required`);
    } else if (validate) {
      const validationError = validate(newValue);
      if (validationError && onError) onError(validationError);
    }
  };

  const inputType = type === "number" ? "text" : type;
  const inputMode = type === "number" ? "numeric" : undefined;
  const pattern = type === "number" ? "[0-9]*" : undefined;

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id} className={labelClassName}>
        {label} {isRequired && <span className='text-red-500'>*</span>}
      </Label>

      <Input
        id={id}
        type={inputType}
        inputMode={inputMode}
        pattern={pattern}
        value={value ?? ""}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        maxLength={maxLength}
        dir={dir}
        name={name}
        className={`h-12 ${error ? "border-red-500" : ""} ${inputClassName}`}
        {...props}
      />

      {error && <p className='text-sm text-red-500'>{error}</p>}
    </div>
  );
};

export const InputRadio = ({
  label,
  value,
  onChange,
  options = [],
  isRequired = false,
  error,
  onError,
  disabled = false,
  className = "",
  labelClassName = "",
  optionsLayout = "horizontal",
  ...props
}) => {
  const handleChange = (newValue) => {
    if (error && onError) {
      onError(null);
    }

    onChange(newValue);
  };

  const handleBlur = () => {
    if (isRequired && !value && onError) {
      onError(`${label} is required`);
    }
  };

  const layoutClass =
    optionsLayout === "horizontal"
      ? "flex flex-wrap gap-4"
      : "flex flex-col space-y-3";

  return (
    <div className={`space-y-2 ${className}`} onBlur={handleBlur}>
      <Label className={labelClassName}>
        {label} {isRequired && <span className='text-red-500'>*</span>}
      </Label>
      <RadioGroup
        value={value}
        onValueChange={handleChange}
        disabled={disabled}
        {...props}>
        <div className={layoutClass}>
          {options.map((option) => (
            <div key={option.value} className='flex items-center space-x-2'>
              <RadioGroupItem
                value={option.value}
                id={option.id || option.value}
                disabled={disabled}
              />
              <Label
                htmlFor={option.id || option.value}
                className='cursor-pointer font-normal'>
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>
      {error && <p className='text-sm text-red-500'>{error}</p>}
    </div>
  );
};

export const InputTextArea = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  isRequired = false,
  error,
  onError,
  disabled = false,
  readOnly = false,
  maxLength,
  rows = 4,
  className = "",
  labelClassName = "",
  textareaClassName = "",
  validate,
  showCharCount = false,
  ...props
}) => {
  const handleChange = (e) => {
    const newValue = e.target.value;

    if (error && onError) {
      onError(null);
    }

    if (validate) {
      const validationError = validate(newValue);
      if (validationError && onError) {
        onError(validationError);
      }
    }

    onChange(e);
  };

  const handleBlur = (e) => {
    const newValue = e.target.value;

    if (isRequired && !newValue.trim() && onError) {
      onError(`${label} is required`);
    } else if (validate) {
      const validationError = validate(newValue);
      if (validationError && onError) {
        onError(validationError);
      }
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className='flex justify-between items-center'>
        <Label htmlFor={id} className={labelClassName}>
          {label} {isRequired && <span className='text-red-500'>*</span>}
        </Label>
        {showCharCount && maxLength && (
          <span className='text-sm text-gray-500'>
            {value?.length || 0}/{maxLength}
          </span>
        )}
      </div>
      <Textarea
        id={id}
        value={value || ""}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        maxLength={maxLength}
        rows={rows}
        className={`${error ? "border-red-500" : ""} ${textareaClassName}`}
        {...props}
      />
      {error && <p className='text-sm text-red-500'>{error}</p>}
    </div>
  );
};
