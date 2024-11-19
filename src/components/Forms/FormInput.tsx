'use client';

import { getErrorMessageByPropertyName } from '@/utils/schema-validator';
import { Input, InputNumber } from 'antd';
import { Controller, useFormContext } from 'react-hook-form';
import LabelUi from '../ui/dashboardUI/LabelUi';
interface IInput {
  name: string;
  type?: string;
  size?: 'large' | 'small';
  value?: string | string[] | undefined;
  id?: string;
  placeholder?: string;
  validation?: object;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  defaultValue?: string | number;
}

const FormInput = ({
  name,
  type,
  size = 'large',
  value,
  id,
  placeholder = 'Please enter..',
  validation,
  label,
  required,
  disabled = false,
  readOnly = false,
  defaultValue,
}: IInput) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const errorMessage = getErrorMessageByPropertyName(errors, name);

  return (
    <>
      {/* {required && type !== "number" ? (
        <span
          style={{
            color: "red",
          }}
        >
          *
        </span>
      ) : null} */}
      {label && type !== 'number' ? (
        <LabelUi>
          {label}
          {required && <span className="text-red-400"> *</span>}
        </LabelUi>
      ) : null}
      <Controller
        control={control}
        name={name}
        render={({ field }) =>
          type === 'password' ? (
            <Input.Password
              disabled={disabled}
              required={required}
              type={type}
              size={size}
              readOnly={readOnly}
              placeholder={placeholder}
              {...field}
              defaultValue={defaultValue && Number(defaultValue)}
              value={value ? value : field.value}
            />
          ) : type === 'number' ? (
            <div className="">
              <LabelUi>
                {label}{' '}
                {required ? (
                  <span
                    style={{
                      color: 'red',
                      textAlign: 'start',
                    }}
                  >
                    *
                  </span>
                ) : null}
              </LabelUi>
              <InputNumber
                type={type}
                style={{ width: '100%', minWidth: '5rem' }}
                readOnly={readOnly}
                disabled={disabled}
                min={0}
                size={size}
                placeholder={placeholder}
                {...field}
                value={value ? value : field.value}
                required={required}
                step={1} // Step to increment/decrement by 1
                parser={(value) => Math.floor(value as any)} // Parses input to only allow integers
              />
            </div>
          ) : (
            <Input
              required={required}
              disabled={disabled}
              type={type}
              size={size}
              readOnly={readOnly}
              placeholder={placeholder}
              {...field}
              value={value ? value : field.value}
            />
          )
        }
      />
      <small style={{ color: 'red' }}>{errorMessage}</small>
    </>
  );
};

export default FormInput;
