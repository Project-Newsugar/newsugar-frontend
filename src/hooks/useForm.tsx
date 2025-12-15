import { useEffect, useState, type ChangeEvent } from "react";

interface userFormProps<T> {
  initialValue: T; // {email : '', password: ''}
  validate: (values: T) => Record<keyof T, string>;
}

function useForm<T>({ initialValue, validate }: userFormProps<T>) {
  const [values, setValues] = useState(initialValue);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (name: keyof T, text: string) => {
    setValues({
      ...values,
      [name]: text,
    });
  };

  const handleBlur = (name: keyof T) => {
    setTouched({
      ...touched,
      [name]: true,
    });
  };

  const getInputProps = (name: keyof T) => {
    const value = values[name];
    const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      handleChange(name, e.target.value);
    const onBlur = () => handleBlur(name);

    return { value, onChange, onBlur };
  };

  useEffect(() => {
    const newErrors: Record<keyof T, string> = validate(values);
    setErrors(newErrors); // 오류 메세지 업데이트
  }, [values]);

  return { values, errors, touched, getInputProps, handleChange };
}

export default useForm;
