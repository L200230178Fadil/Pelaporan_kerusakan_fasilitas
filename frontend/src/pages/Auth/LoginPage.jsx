import { useForm } from 'react-hook-form'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Button, Input } from '../../components/ui'
import toast from 'react-hot-toast'
import { Building2, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

export default function LoginPage() {
  // const { user, login } = useAuth()
  const navigate = useNavigate()
  const [showPass, setShowPass] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm()

  if (user) return <Navigate to="/" replace />

  const onSubmit = async (data) => {
    try {
      await login(data)
      toast.success('Selamat datang kembali!')
      navigate('/')
    } catch (e) {
      const msg = e.response?.data?.message || 'Login gagal.'
      if (e.response?.status === 422) {
        const errs = e.response.data.errors
        Object.keys(errs).forEach(k => setError(k, { message: errs[k][0] }))
      } else {
        toast.error(msg)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-800 to-surface-700 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-white/10 backdrop-blur items-center justify-center mb-4">
            <Building2 size={26} className="text-white" />
          </div>
          <h1 className="font-display font-bold text-white text-2xl">SiPeduli</h1>
          <p className="text-primary-200 text-sm mt-1">Sistem Pelaporan Fasilitas Kampus</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-7 shadow-2xl animate-slide-up">
          <h2 className="font-display font-semibold text-surface-900 text-lg mb-6">Masuk ke Akun</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="nama@email.com"
              error={errors.email?.message}
              {...register('email', {
                required: 'Email wajib diisi.',
                pattern: { value: /\S+@\S+\.\S+/, message: 'Format email tidak valid.' }
              })}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password', { required: 'Password wajib diisi.' })}
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                className="absolute right-3 top-[34px] text-surface-400 hover:text-surface-600"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <Button type="submit" className="w-full mt-2" size="lg" loading={isSubmitting}>
              Masuk
            </Button>
          </form>

          <p className="text-center text-xs text-surface-400 mt-5">
            UMS — Teknik Informatika © 2026
          </p>
        </div>
      </div>
    </div>
  )
}
