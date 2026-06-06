'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import HomeLayout from '@/app/components/HomeLayout'
import { CldUploadWidget } from 'next-cloudinary'
import { useUser } from '@/context/UserContext'

// ─── Types ───────────────────────────────────────────────────────────────────

interface ProfileForm {
  name: string
  bio: string
  profileImg: string | null
}

// ─── Section Card ─────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-gray-800 pt-8 mt-8 first:mt-0 first:pt-0 first:border-t-0">
      <h2 className="text-white font-semibold text-base mb-5">{title}</h2>
      {children}
    </div>
  )
}

// ─── Input Field ─────────────────────────────────────────────────────────────

function Field({
  label, hint, children,
}: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-500 mt-1.5">{hint}</p>}
    </div>
  )
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ msg, type }: { msg: string; type: 'success' | 'error' }) {
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-xl shadow-2xl text-sm font-medium transition-all
      ${type === 'success' ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'}`}
    >
      <span>{type === 'success' ? '✓' : '✕'}</span>
      {msg}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EditProfilePage() {
  const router = useRouter()
  const { user, refreshUser } = useUser()

  // ── Profile form ──────────────────────────────────────────────────────────
  const [profile, setProfile] = useState<ProfileForm>({ name: '', bio: '', profileImg: null })
  const [profileLoading, setProfileLoading] = useState(false)

  // ── Password form ─────────────────────────────────────────────────────────
  const [oldPass, setOldPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [passLoading, setPassLoading] = useState('')   // '' | 'change' | 'forgot'
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)

  // ── Toast ─────────────────────────────────────────────────────────────────
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  function showToast(msg: string, type: 'success' | 'error') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  // ── Load current profile ──────────────────────────────────────────────────
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        bio: user.bio || '',
        profileImg: user.profileImg || null,
      })
    } else {
      api.get('/user/me').then(res => {
        const u = res.data.formatted
        setProfile({ name: u.name, bio: u.bio || '', profileImg: u.profileImg })
      })
    }
  }, [user])

  // ── Save profile ──────────────────────────────────────────────────────────
  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    if (!profile.name.trim()) { showToast('Name cannot be empty', 'error'); return }
    setProfileLoading(true)
    try {
      await api.put('/user/me/update', {
        name: profile.name,
        bio: profile.bio,
        profileImg: profile.profileImg,
      })
      await refreshUser()
      showToast('Profile updated!', 'success')
    } catch (err: unknown) {
      const e = err as { response?: { data?: { msg?: string } } }
      showToast(e?.response?.data?.msg || 'Failed to update profile', 'error')
    } finally {
      setProfileLoading(false)
    }
  }

  // ── Change password ───────────────────────────────────────────────────────
  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    if (newPass.length < 6) { showToast('New password must be at least 6 characters', 'error'); return }
    if (newPass !== confirmPass) { showToast('Passwords do not match', 'error'); return }
    setPassLoading('change')
    try {
      const res = await api.put('/user/me/change-password', { oldPassword: oldPass, newPassword: newPass })
      showToast(res.data.msg || 'Password changed!', 'success')
      setOldPass(''); setNewPass(''); setConfirmPass('')
    } catch (err: unknown) {
      const e = err as { response?: { data?: { msg?: string } } }
      showToast(e?.response?.data?.msg || 'Failed to change password', 'error')
    } finally {
      setPassLoading('')
    }
  }

  // ── Forgot password → send reset email ────────────────────────────────────
  async function handleForgotPassword() {
    const email = user?.email
    if (!email) { showToast('No email found', 'error'); return }
    setPassLoading('forgot')
    try {
      await api.post('/auth/forgot-password', { email })
      showToast('Reset link sent to your email', 'success')
    } catch (err: unknown) {
      const e = err as { response?: { data?: { msg?: string } } }
      showToast(e?.response?.data?.msg || 'Failed to send reset email', 'error')
    } finally {
      setPassLoading('')
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <HomeLayout showSidebar={false}>
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-8">

          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <button
              onClick={() => router.back()}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">Edit Profile</h1>
              <p className="text-gray-500 text-sm">Manage your public profile and account security</p>
            </div>
          </div>

          {/* ── Profile Section ── */}
          <Section title="Profile Information">
            <form onSubmit={handleSaveProfile}>

              {/* Avatar */}
              <Field label="Profile Photo">
                <div className="flex items-center gap-5">
                  {/* Current avatar preview */}
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center flex-shrink-0">
                    {profile.profileImg && (profile.profileImg.startsWith('http') || profile.profileImg.length > 10) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={
                          profile.profileImg.startsWith('http')
                            ? profile.profileImg
                            : `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${profile.profileImg}`
                        }
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-bold text-2xl">
                        {profile.name?.charAt(0)?.toUpperCase() || '?'}
                      </span>
                    )}
                  </div>

                  {/* Upload buttons */}
                  <div className="flex flex-col gap-2">
                    <CldUploadWidget
                      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default'}
                      options={{ maxFiles: 1, resourceType: 'image', cropping: true, croppingAspectRatio: 1 }}
                      onSuccess={(result) => {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const info = (result as any).info
                        if (info?.public_id) {
                          setProfile(p => ({ ...p, profileImg: info.public_id }))
                        }
                      }}
                    >
                      {({ open }) => (
                        <button
                          type="button"
                          onClick={() => open()}
                          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          {profile.profileImg ? 'Change Photo' : 'Upload Photo'}
                        </button>
                      )}
                    </CldUploadWidget>
                    {profile.profileImg && (
                      <button
                        type="button"
                        onClick={() => setProfile(p => ({ ...p, profileImg: null }))}
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        Remove Photo
                      </button>
                    )}
                  </div>
                </div>
              </Field>

              {/* Name */}
              <Field label="Name" hint="This is your public display name">
                <input
                  type="text"
                  value={profile.name}
                  onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                  maxLength={60}
                  placeholder="Your name"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3.5 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                />
              </Field>

              {/* Bio */}
              <Field label="Bio" hint="Tell the world a little about yourself (max 200 characters)">
                <textarea
                  value={profile.bio}
                  onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                  maxLength={200}
                  rows={3}
                  placeholder="Write a short bio…"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3.5 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
                />
                <p className="text-xs text-gray-600 mt-1 text-right">{profile.bio.length}/200</p>
              </Field>

              <button
                type="submit"
                disabled={profileLoading}
                className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                {profileLoading ? 'Saving…' : 'Save Changes'}
              </button>
            </form>
          </Section>

          {/* ── Password Section ── */}
          <Section title="Change Password">
            <form onSubmit={handleChangePassword} className="space-y-4">

              {/* Current password */}
              <Field label="Current Password">
                <div className="relative">
                  <input
                    type={showOld ? 'text' : 'password'}
                    value={oldPass}
                    onChange={e => setOldPass(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3.5 py-2.5 pr-10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  />
                  <button type="button" onClick={() => setShowOld(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                    {showOld
                      ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    }
                  </button>
                </div>
              </Field>

              {/* New password */}
              <Field label="New Password" hint="Minimum 6 characters">
                <div className="relative">
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPass}
                    onChange={e => setNewPass(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3.5 py-2.5 pr-10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  />
                  <button type="button" onClick={() => setShowNew(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                    {showNew
                      ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    }
                  </button>
                </div>
              </Field>

              {/* Confirm password */}
              <Field label="Confirm New Password">
                <input
                  type="password"
                  value={confirmPass}
                  onChange={e => setConfirmPass(e.target.value)}
                  placeholder="Re-enter new password"
                  className={`w-full bg-gray-800 border rounded-lg px-3.5 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 transition-colors ${
                    confirmPass && newPass !== confirmPass
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-700 focus:ring-orange-500 focus:border-orange-500'
                  }`}
                />
                {confirmPass && newPass !== confirmPass && (
                  <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
                )}
              </Field>

              {/* Actions row */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="submit"
                  disabled={!!passLoading}
                  className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  {passLoading === 'change' ? 'Updating…' : 'Update Password'}
                </button>

                <button
                  type="button"
                  disabled={!!passLoading}
                  onClick={handleForgotPassword}
                  className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 disabled:opacity-60 text-gray-400 hover:text-white text-sm font-medium rounded-lg transition-colors"
                >
                  {passLoading === 'forgot' ? 'Sending…' : 'Forgot password? Send reset link'}
                </button>
              </div>
            </form>
          </Section>

        </div>
      </div>

      {/* Toast */}
      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </HomeLayout>
  )
}
