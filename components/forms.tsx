import React from "react";
import { FieldErrorsImpl, FieldValues, UseFormReturn } from "react-hook-form";

interface CustomErrorMessages {
  [key: string]: string;
}

export const Label = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => {
  return (
    <label className={`flex flex-col gap-1`}>
      <div className={`uppercase text-xs font-bold text-zinc-500`}>{label}</div>
      {children}
    </label>
  );
};

export const Field = ({
  label,
  name,
  errors,
  customErrorMessages,
  children,
}: {
  label: string;
  name: string;
  errors: FieldErrorsImpl;
  customErrorMessages?: CustomErrorMessages;
  children: React.ReactNode;
}) => {
  return (
    <Label label={label}>
      <div>{children}</div>
      <FormError
        error={errors[name] as unknown as { type: string }}
        customErrorMessages={customErrorMessages}
      />
    </Label>
  );
};

export const FormError = ({
  error,
  customErrorMessages,
}: {
  error?: { type: string } | null;
  customErrorMessages?: CustomErrorMessages;
}) => {
  if (!error) return <></>;
  console.log(error);

  const errorMessages = {
    required: "Required field",
    fallback: "Invalid value provided",
    ...customErrorMessages,
  } as { [key: string]: string };

  return (
    <DisplayError>
      {errorMessages[error.type] || errorMessages.fallback}
    </DisplayError>
  );
};

export const DisplayError = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`block text-xs text-red-400 font-bold uppercase mt-0.5 ${className}`}
    >
      {children}
    </div>
  );
};

export const DisplayText = ({ children }: { children: React.ReactNode }) => {
  return <div className="text-sm">{children}</div>;
};
