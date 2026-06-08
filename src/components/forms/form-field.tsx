import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BaseFieldProps = {
  label: string;
  name: string;
  helper?: string;
  className?: string;
};

type InputFieldProps = BaseFieldProps &
  InputHTMLAttributes<HTMLInputElement> & {
    kind?: "input";
  };

type TextareaFieldProps = BaseFieldProps &
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    kind: "textarea";
  };

type SelectFieldProps = BaseFieldProps &
  SelectHTMLAttributes<HTMLSelectElement> & {
    kind: "select";
    options: string[];
  };

type FormFieldProps = InputFieldProps | TextareaFieldProps | SelectFieldProps;

const fieldClass =
  "mt-2 w-full rounded-md border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-blue002 focus:ring-4 focus:ring-blue002/10";

export function FormField(props: FormFieldProps) {
  if (props.kind === "textarea") {
    const { label, name, helper, className, kind: _kind, ...fieldProps } = props;
    void _kind;

    return (
      <label className={cn("block", className)}>
        <span className="text-sm font-bold text-ink">{label}</span>
        <textarea id={name} name={name} className={fieldClass} rows={5} {...fieldProps} />
        {helper ? <span className="mt-2 block text-xs leading-5 text-slate-500">{helper}</span> : null}
      </label>
    );
  }

  if (props.kind === "select") {
    const { label, name, helper, className, kind: _kind, options, ...fieldProps } = props;
    void _kind;

    return (
      <label className={cn("block", className)}>
        <span className="text-sm font-bold text-ink">{label}</span>
        <select id={name} name={name} className={fieldClass} {...fieldProps}>
          <option value="">Select one</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {helper ? <span className="mt-2 block text-xs leading-5 text-slate-500">{helper}</span> : null}
      </label>
    );
  }

  const { label, name, helper, className, kind: _kind, ...fieldProps } = props;
  void _kind;

  return (
    <label className={cn("block", className)}>
      <span className="text-sm font-bold text-ink">{label}</span>
      <input id={name} name={name} className={fieldClass} {...fieldProps} />
      {helper ? <span className="mt-2 block text-xs leading-5 text-slate-500">{helper}</span> : null}
    </label>
  );
}
