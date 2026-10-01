/**
 * ApplicationDetailForm.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * React Hook Form + Zod validation form for applicant project details.
 *
 * ⚠️ ARCHITECTURAL RULE:
 * Client-side Zod validation provides instant, accessible feedback to the user.
 * The Java Spring Boot backend (Hibernate Validator / JSR-380 @Valid annotations)
 * remains the final, authoritative source of truth.
 */

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Input from '../../../../components/forms/Input'
import Button from '../../../../components/ui/Button'
import Alert from '../../../../components/ui/Alert'

// Validation schema matching discovery doc rules
const applicantDetailSchema = z.object({
  enterpriseName: z
    .string()
    .min(3, 'Enterprise / Company name must be at least 3 characters.')
    .max(150, 'Name cannot exceed 150 characters.'),
  projectTitle: z
    .string()
    .min(5, 'Project title must be at least 5 characters.')
    .max(200, 'Project title cannot exceed 200 characters.'),
  lineOfActivity: z
    .string()
    .min(3, 'Line of activity / manufactured product is required.'),
  proposedInvestment: z
    .coerce
    .number({ invalid_type_error: 'Investment must be a valid number (in Lakhs).' })
    .positive('Investment must be greater than 0 Lakhs.'),
  proposedEmployment: z
    .coerce
    .number({ invalid_type_error: 'Proposed employment must be an integer.' })
    .int('Employment count must be a whole number.')
    .min(1, 'Proposed employment must be at least 1 person.'),
  contactPersonName: z
    .string()
    .min(2, 'Contact person name is required.'),
  contactMobile: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Must be a valid 10-digit Indian mobile number starting with 6-9.'),
  contactEmail: z
    .string()
    .email('Please enter a valid email address.'),
  gstinNumber: z
    .string()
    .optional()
    .refine((val) => !val || /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(val), {
      message: 'Invalid 15-character GSTIN format (e.g. 23AABCS1429E1Z8).',
    }),
  panNumber: z
    .string()
    .optional()
    .refine((val) => !val || /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(val), {
      message: 'Invalid 10-character PAN format (e.g. AABCS1429E).',
    }),
})

export default function ApplicationDetailForm({ initialData = {}, onSave, isReadOnly = false }) {
  const [successMessage, setSuccessMessage] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm({
    resolver: zodResolver(applicantDetailSchema),
    defaultValues: {
      enterpriseName: initialData.enterpriseName || '',
      projectTitle: initialData.projectTitle || '',
      lineOfActivity: initialData.lineOfActivity || '',
      proposedInvestment: initialData.proposedInvestment || '',
      proposedEmployment: initialData.proposedEmployment || '',
      contactPersonName: initialData.contactPersonName || '',
      contactMobile: initialData.contactMobile || '',
      contactEmail: initialData.contactEmail || '',
      gstinNumber: initialData.gstinNumber || '',
      panNumber: initialData.panNumber || '',
    },
  })

  const onSubmit = async (values) => {
    setIsSubmitting(true)
    setSuccessMessage(null)
    try {
      if (!onSave) throw new Error('Saving is currently unavailable.')
      await onSave(values)
      setSuccessMessage('Project details updated successfully.')
      reset(values)
    } catch (err) {
      console.error('Update failed:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {successMessage && (
        <Alert variant="success" message={successMessage} dismissible onDismiss={() => setSuccessMessage(null)} />
      )}

      {/* Enterprise & Activity */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
        <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2.5 mb-4">
          1. Enterprise &amp; Project Description
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Enterprise / Company Name"
            required
            disabled={isReadOnly}
            error={errors.enterpriseName?.message}
            {...register('enterpriseName')}
          />

          <Input
            label="Line of Industrial Activity"
            required
            disabled={isReadOnly}
            error={errors.lineOfActivity?.message}
            {...register('lineOfActivity')}
          />

          <div className="md:col-span-2">
            <Input
              label="Project Title / Proposal Summary"
              required
              disabled={isReadOnly}
              error={errors.projectTitle?.message}
              {...register('projectTitle')}
            />
          </div>
        </div>
      </div>

      {/* Investment & Employment */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
        <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2.5 mb-4">
          2. Proposed Investment &amp; Employment
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Proposed Capital Investment (in ₹ Lakhs)"
            type="number"
            step="0.01"
            required
            disabled={isReadOnly}
            helperText="Plant, machinery, and civil construction cost"
            error={errors.proposedInvestment?.message}
            {...register('proposedInvestment')}
          />

          <Input
            label="Proposed Direct Employment (Persons)"
            type="number"
            required
            disabled={isReadOnly}
            helperText="Total full-time workforce planned"
            error={errors.proposedEmployment?.message}
            {...register('proposedEmployment')}
          />
        </div>
      </div>

      {/* Contact & Statutory */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
        <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2.5 mb-4">
          3. Contact Person &amp; Tax Identification
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            label="Authorized Person Name"
            required
            disabled={isReadOnly}
            error={errors.contactPersonName?.message}
            {...register('contactPersonName')}
          />

          <Input
            label="Mobile Number"
            required
            disabled={isReadOnly}
            error={errors.contactMobile?.message}
            {...register('contactMobile')}
          />

          <Input
            label="Email Address"
            type="email"
            required
            disabled={isReadOnly}
            error={errors.contactEmail?.message}
            {...register('contactEmail')}
          />

          <Input
            label="GSTIN Number"
            disabled={isReadOnly}
            placeholder="23AABCS1429E1Z8"
            error={errors.gstinNumber?.message}
            {...register('gstinNumber')}
          />

          <Input
            label="PAN Number"
            disabled={isReadOnly}
            placeholder="AABCS1429E"
            error={errors.panNumber?.message}
            {...register('panNumber')}
          />
        </div>
      </div>

      {!isReadOnly && (
        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={!isDirty || isSubmitting}
            isLoading={isSubmitting}
          >
            Save Project Updates
          </Button>
        </div>
      )}
    </form>
  )
}
