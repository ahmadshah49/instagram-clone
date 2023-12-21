import { useState } from 'react'
const useForm = (values) => {
  const [form, setForm] = useState(values);
  const onChangeHandler = (e) => {
    setForm((formvalue) => ({
      ...formvalue,
      [e.target.name]: e.target.value
    }));
    
  }
  const resetFormData = () => {
    setForm(values)
  };

  return {
    form,
    onChangeHandler,
    resetFormData
  }
}

export default useForm