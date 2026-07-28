import React, { useRef, useState } from 'react'
import { useProfileContext } from '@renderer/state/profile-context'
import { validate } from '@renderer/services/validation'
import { useModalFocus } from '@renderer/hooks/use-modal-focus'

interface EditProfileModalProps {
  onClose: () => void
}

interface FormState {
  name: string
  email: string
  phone: string
  careeName: string
  bloodType: string
}

/**
 * Mounted only while open (see ProfileScreen), so the form seeds itself from the
 * current profile via useState initializers — no syncing effect required.
 */
export function EditProfileModal({ onClose }: EditProfileModalProps): React.JSX.Element {
  const { profile, update } = useProfileContext()

  const initial: FormState = {
    name: profile?.name ?? '',
    email: profile?.email ?? '',
    phone: profile?.phone ?? '',
    careeName: profile?.careeName ?? '',
    bloodType: profile?.bloodType ?? ''
  }

  const [form, setForm] = useState<FormState>(initial)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const firstFieldRef = useRef<HTMLInputElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const isDirty = (Object.keys(form) as (keyof FormState)[]).some((k) => form[k] !== initial[k])

  const requestClose = (): void => {
    if (isDirty && !window.confirm('Discard changes?')) return
    onClose()
  }

  // Focus trap + Escape + focus restore for the dialog.
  useModalFocus(cardRef, { onClose: requestClose, initialFocusRef: firstFieldRef })

  const set =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }))
    }

  const save = async (): Promise<void> => {
    const err = validate.required(form.name, 'Full name') ?? validate.email(form.email)
    if (err) {
      setError(err)
      return
    }
    setSaving(true)
    setError(null)
    try {
      await update({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        careeName: form.careeName.trim() || undefined,
        bloodType: form.bloodType.trim() || undefined
      })
      onClose()
    } catch {
      setError('Could not save changes. Please try again.')
      setSaving(false)
    }
  }

  const onSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    void save()
  }

  const initials = (form.name || 'C')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="modal-scrim" onMouseDown={requestClose}>
      <div
        ref={cardRef}
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-label="Edit Profile"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal-head">
          <h2 className="modal-title">Edit Profile</h2>
          <button type="button" className="peggy-close" onClick={requestClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="modal-avatar-row">
          <div className="avatar avatar-lg" aria-hidden="true">
            {initials}
          </div>
          {/* aria-disabled, not the native `disabled` attribute: a disabled button is
              skipped by the tab order and never announced, so the control would be
              invisible to screen reader users rather than merely unavailable. */}
          <button
            type="button"
            className="btn btn-outline modal-photo-btn"
            aria-disabled="true"
            aria-label="Change photo (coming soon)"
            onClick={(e) => e.preventDefault()}
          >
            Change photo
          </button>
        </div>

        <form onSubmit={onSubmit}>
          {error && (
            <div className="error-banner" role="alert" id="ep-error">
              {error}
            </div>
          )}

          <div className="field">
            <label className="field-label" htmlFor="ep-name">
              Full name
            </label>
            <input
              id="ep-name"
              ref={firstFieldRef}
              className="field-input"
              value={form.name}
              onChange={set('name')}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? 'ep-error' : undefined}
            />
          </div>

          <div className="field">
            <label className="field-label" htmlFor="ep-email">
              Email
            </label>
            <input
              id="ep-email"
              type="email"
              className="field-input"
              value={form.email}
              onChange={set('email')}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? 'ep-error' : undefined}
            />
          </div>

          <div className="field">
            <label className="field-label" htmlFor="ep-phone">
              Phone
            </label>
            <input
              id="ep-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              className="field-input"
              value={form.phone}
              onChange={set('phone')}
            />
          </div>

          <div className="field">
            <label className="field-label" htmlFor="ep-caree">
              Caree name
            </label>
            <input
              id="ep-caree"
              className="field-input"
              value={form.careeName}
              onChange={set('careeName')}
            />
          </div>

          <div className="field">
            <label className="field-label" htmlFor="ep-blood">
              Blood type
            </label>
            <input
              id="ep-blood"
              className="field-input"
              value={form.bloodType}
              onChange={set('bloodType')}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-outline modal-btn" onClick={requestClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary modal-btn" disabled={saving}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
