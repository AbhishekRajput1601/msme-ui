/**
 * FileUpload.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Accessible file upload component with drag-and-drop, client-side validation,
 * and live progress indicator powered by httpClient.upload().
 */

import React, { useState, useRef, useId } from 'react'
import { upload } from '../../api/httpClient'
import Button from '../ui/Button'

export default function FileUpload({
  label,
  uploadUrl,
  fieldName = 'file',
  extraData = {},
  allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'docx'],
  maxSizeMb = 10,
  onUploadSuccess,
  onUploadError,
  onFileSelect,
  required = false,
  disabled = false,
  helperText,
  className = '',
}) {
  const inputId = useId()
  const fileInputRef = useRef(null)

  const [selectedFile, setSelectedFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(null) // null = not started, 0..100
  const [isUploading, setIsUploading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successResponse, setSuccessResponse] = useState(null)

  const validateFile = (file) => {
    setErrorMessage(null)
    if (!file) return false

    // Check file size
    const maxSizeBytes = maxSizeMb * 1024 * 1024
    if (file.size > maxSizeBytes) {
      setErrorMessage(`File exceeds maximum size limit of ${maxSizeMb} MB.`)
      return false
    }

    // Check file extension
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (allowedExtensions.length > 0 && !allowedExtensions.includes(ext)) {
      setErrorMessage(
        `Invalid file type (.${ext}). Allowed formats: ${allowedExtensions.join(', ')}`,
      )
      return false
    }

    return true
  }

  const handleFileChosen = (file) => {
    if (!validateFile(file)) {
      setSelectedFile(null)
      return
    }
    setSelectedFile(file)
    setSuccessResponse(null)
    setUploadProgress(null)
    onFileSelect?.(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    if (!disabled && !isUploading) setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    if (disabled || isUploading) return

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChosen(e.dataTransfer.files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !uploadUrl || isUploading) return

    setIsUploading(true)
    setUploadProgress(0)
    setErrorMessage(null)

    try {
      const formData = new FormData()
      formData.append(fieldName, selectedFile)

      Object.entries(extraData).forEach(([k, v]) => {
        formData.append(k, v)
      })

      const response = await upload(
        uploadUrl,
        formData,
        (percent) => {
          setUploadProgress(percent)
        },
      )

      setSuccessResponse(response || 'Uploaded')
      onUploadSuccess?.(response, selectedFile)
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'File upload failed.'
      setErrorMessage(msg)
      onUploadError?.(err)
    } finally {
      setIsUploading(false)
    }
  }

  const handleClear = () => {
    setSelectedFile(null)
    setUploadProgress(null)
    setSuccessResponse(null)
    setErrorMessage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Dropzone container */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled && !isUploading) {
            e.preventDefault()
            fileInputRef.current?.click()
          }
        }}
        className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all cursor-pointer select-none
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
          ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50/50'
              : errorMessage
              ? 'border-red-300 bg-red-50/20'
              : 'border-gray-300 bg-gray-50/50 hover:bg-gray-100/50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
      >
        <input
          ref={fileInputRef}
          id={inputId}
          type="file"
          className="hidden"
          disabled={disabled || isUploading}
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileChosen(e.target.files[0])
            }
          }}
          accept={allowedExtensions.map((ext) => `.${ext}`).join(',')}
        />

        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 mb-3">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>

        <p className="text-sm font-medium text-gray-700">
          <span className="text-indigo-600 font-semibold hover:underline">Click to upload</span> or drag and drop
        </p>

        <p className="mt-1 text-xs text-gray-500">
          {allowedExtensions.map((e) => e.toUpperCase()).join(', ')} up to {maxSizeMb} MB
        </p>
      </div>

      {/* Selected file preview & progress */}
      {selectedFile && (
        <div className="mt-3 rounded-lg border border-gray-200 bg-white p-3 shadow-xs">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <svg className="h-5 w-5 shrink-0 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div className="min-w-0 truncate">
                <p className="text-xs font-semibold text-gray-900 truncate">{selectedFile.name}</p>
                <p className="text-[11px] text-gray-400">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {uploadUrl && !successResponse && (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={handleUpload}
                  isLoading={isUploading}
                >
                  Upload
                </Button>
              )}
              <button
                type="button"
                onClick={handleClear}
                disabled={isUploading}
                aria-label="Remove selected file"
                className="text-gray-400 hover:text-red-500 rounded p-1 transition-colors disabled:opacity-50"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Upload Progress Bar */}
          {uploadProgress !== null && (
            <div className="mt-2.5" aria-live="polite">
              <div className="flex justify-between text-[11px] font-medium text-gray-600 mb-1">
                <span>{uploadProgress < 100 ? 'Uploading...' : 'Processing...'}</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full bg-indigo-600 transition-all duration-200 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {successResponse && (
            <p className="mt-2 text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <svg className="h-3.5 w-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              File uploaded successfully
            </p>
          )}
        </div>
      )}

      {errorMessage && (
        <p role="alert" className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1">
          <svg className="h-3.5 w-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {errorMessage}
        </p>
      )}

      {!errorMessage && helperText && (
        <p className="mt-1.5 text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  )
}
