'use client'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import axios from 'axios'
import { useRouter } from 'next/navigation' 

export default function SignUp() {
  const validationSchema = Yup.object({
    name: Yup.string().required('Full name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    phone: Yup.string().required('Phone is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters long')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Please confirm your password'),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  })

  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      const user = {
        full_name: data.name,
        phone_number: data.phone,
        email: data.email,
        password: data.password,
      }
      const res = await axios.post('http://localhost:8000/api/v1/register', user)
      if (res.status === 200) {
        router.push('/login') 
      } else {
        alert('Something went wrong. Please try again.')
      }
    } catch (error) {
      alert(error.response?.data?.message || 'An unexpected error occurred.')
    }
  }

  return (
    <div className="h-screen bg-[#fcf8ef] flex items-center justify-center">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg border border-gray-200">
        <h2 className="text-center text-2xl font-bold text-[#d76d77] mb-6">Join Us!</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="Full Name"
              {...register('name')}
              className="w-full p-3 border border-gray-300 rounded focus:ring-[#d76d77] focus:outline-none"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              {...register('email')}
              className="w-full p-3 border border-gray-300 rounded focus:ring-[#d76d77] focus:outline-none"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
          <div>
            <input
              type="text"
              placeholder="Phone"
              {...register('phone')}
              className="w-full p-3 border border-gray-300 rounded focus:ring-[#d76d77] focus:outline-none"
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              {...register('password')}
              className="w-full p-3 border border-gray-300 rounded focus:ring-[#d76d77] focus:outline-none"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>
          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              {...register('confirmPassword')}
              className="w-full p-3 border border-gray-300 rounded focus:ring-[#d76d77] focus:outline-none"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-[#d76d77] text-white py-3 rounded hover:bg-[#b65a5b] focus:ring-2 focus:ring-[#d76d77]"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{' '}
          <a href="/login" className="text-[#d76d77] hover:underline">Log in</a>
        </p>
      </div>
    </div>
  )
}
