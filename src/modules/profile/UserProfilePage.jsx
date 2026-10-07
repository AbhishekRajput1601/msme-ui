import React, { useState, useEffect } from 'react'
import { useTranslation } from '../../hooks/useTranslation'
import { useAuth } from '../../hooks/useAuth'
import ProfileNavTabs from './components/ProfileNavTabs'
import { fetchUserProfile, updateUserProfile } from './services/profileService'

export default function UserProfilePage() {
  const { locale } = useTranslation()
  const hindi = locale === 'hi'
  const { currentUser } = useAuth()

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const [formData, setFormData] = useState({
    userId: '',
    roleName: 'ROLE_APPLICANT',
    firstName: '',
    middleName: '',
    lastName: '',
    fatherOrHusbandFirstName: '',
    fatherOrHusbandMiddleName: '',
    fatherOrHusbandLastName: '',
    nameOfUnit: '',
    aadhaarNumber: '',
    benificiaryUser: '0',
    samagraId: '',
    emailId: '',
    mobileNumber: '',
    telephoneNumber: '',
    fax: '',
    website: '',
    dob: '',
    genderId: '1',
    categoryId: '1',
    religion: 'Hinduism',
    panNo: '',
    domicile: 'Yes',
    minority: '0',
    physicallyDisabled: '0',
    proofOfIdentity: 'Aadhaar Card',
    proofOfIdentityNo: '',
    proofOfAddress: 'Electricity Bill',
    address1: '',
    address2: '',
    address3: '',
    city: '',
    stateId: '20', // Madhya Pradesh
    districtId: 'Bhopal',
    tehsilId: 'Huzur',
    blockId: 'Phanda',
    pinCode: '',
    sameAsPresent: false,
    permanentAddress1: '',
    permanentAddress2: '',
    permanentAddress3: '',
    permanentCity: '',
    permanentStateId: '20',
    permanentDistrictId: 'Bhopal',
    permanentTehsilId: '',
    permanentTehsilName: 'Huzur',
    permanentBlockId: '',
    permanentBlockName: 'Phanda',
    permanentPinCode: '',
  })

  const [files, setFiles] = useState({
    panUpload: null,
    proofOfIdentityUpload: null,
    proofOfAddressUpload: null,
    categoryUpload: null,
  })

  useEffect(() => {
    let active = true
    setLoading(true)
    fetchUserProfile()
      .then((data) => {
        if (!active) return
        if (data) {
          setFormData((prev) => ({
            ...prev,
            ...data,
            userId: data.userId || currentUser?.username || 'APPLICANT',
            roleName: data.roleName || 'ROLE_APPLICANT',
            nameOfUnit: data.nameOfUnit || '',
            aadhaarNumber: data.aadhaarNumber || '',
            benificiaryUser: String(data.benificiaryUser !== undefined ? data.benificiaryUser : '0'),
            samagraId: data.samagraId || '',
            domicile: data.domicile || 'Yes',
            minority: String(data.minority || '0'),
            physicallyDisabled: String(data.physicallyDisabled || '0'),
            genderId: String(data.genderId || '1'),
            categoryId: String(data.categoryId || '1'),
            permanentTehsilId: data.permanentTehsilId || '',
            permanentBlockId: data.permanentBlockId || '',
          }))
        }
      })
      .catch((err) => {
        if (active) {
          setErrorMessage(err.message || 'Could not load profile details.')
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [currentUser])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (type === 'checkbox' && name === 'sameAsPresent') {
      setFormData((prev) => ({
        ...prev,
        sameAsPresent: checked,
        ...(checked
          ? {
            permanentAddress1: prev.address1,
            permanentAddress2: prev.address2,
            permanentAddress3: prev.address3,
            permanentCity: prev.city,
            permanentStateId: prev.stateId,
            permanentDistrictId: prev.districtId,
            permanentTehsilId: prev.tehsilId,
            permanentTehsilName: prev.tehsilId,
            permanentBlockId: prev.blockId,
            permanentBlockName: prev.blockId,
            permanentPinCode: prev.pinCode,
          }
          : {}),
      }))
      return
    }

    setFormData((prev) => {
      const next = { ...prev, [name]: value }
      if (prev.sameAsPresent && name.startsWith('address')) {
        if (name === 'address1') next.permanentAddress1 = value
        if (name === 'address2') next.permanentAddress2 = value
        if (name === 'address3') next.permanentAddress3 = value
        if (name === 'city') next.permanentCity = value
        if (name === 'pinCode') next.permanentPinCode = value
      }
      return next
    })
  }

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target
    if (selectedFiles && selectedFiles[0]) {
      const file = selectedFiles[0]
      if (file.size > 500 * 1024) {
        alert(hindi ? 'फ़ाइल का आकार 500 KB से अधिक नहीं होना चाहिए।' : 'File size should not exceed 500 KB.')
        e.target.value = ''
        return
      }
      setFiles((prev) => ({ ...prev, [name]: file }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage(null)
    setErrorMessage(null)

    if (!formData.firstName || !formData.lastName) {
      setErrorMessage(hindi ? 'कृपया पहला और अंतिम नाम दर्ज करें।' : 'Please enter first and last name.')
      return
    }

    if (!formData.mobileNumber || !formData.emailId) {
      setErrorMessage(hindi ? 'कृपया मोबाइल नंबर और ईमेल दर्ज करें।' : 'Please provide mobile number and email.')
      return
    }

    setSubmitting(true)
    try {
      const dataPayload = new FormData()
      Object.entries(formData).forEach(([k, v]) => {
        if (v !== undefined && v !== null) {
          dataPayload.append(k, v)
        }
      })
      Object.entries(files).forEach(([k, file]) => {
        if (file) {
          dataPayload.append(k, file)
        }
      })

      const res = await updateUserProfile(dataPayload)
      setMessage(res.successMessage || (hindi ? 'उपयोगकर्ता प्रोफ़ाइल सफलतापूर्वक अपडेट की गई।' : 'User profile updated successfully.'))
      setIsEditing(false)
    } catch (err) {
      setErrorMessage(err.message || (hindi ? 'प्रोफ़ाइल अपडेट करने में त्रुटि।' : 'Failed to update profile.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="profile-page-container">
      {/* Top Tab Navigation & Breadcrumbs */}
      <ProfileNavTabs activeTab="user" pageTitle={hindi ? 'उपयोगकर्ता प्रोफ़ाइल' : 'User Profile Details'} />

      {/* Legacy Government Form Banner */}
      <div className="gov-form-banner">
        <div className="gov-form-banner-title">
          <h2>{hindi ? 'उपयोगकर्ता विवरण' : 'View / Update User Details'}</h2>
          <p>{hindi ? 'मध्य प्रदेश शासन — सूक्ष्म, लघु एवं मध्यम उद्यम विभाग' : 'Government of Madhya Pradesh — Department of MSME'}</p>
        </div>

        <div>
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="btn btn-warning"
            >
              <i className="fa fa-pencil" /> {hindi ? 'प्रोफ़ाइल संपादित करें' : 'Edit Profile'}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="btn btn-default"
            >
              <i className="fa fa-times" /> {hindi ? 'रद्द करें' : 'Cancel Edit'}
            </button>
          )}
        </div>
      </div>

      {/* Notifications */}
      {message && (
        <div className="alert alert-success" role="alert">
          <i className="fa fa-check-circle" /> {message}
        </div>
      )}

      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          <i className="fa fa-exclamation-triangle" /> {errorMessage}
        </div>
      )}

      {loading ? (
        <div className="panel panel-default">
          <div className="panel-body text-center py-5">
            <i className="fa fa-spinner fa-spin fa-2x text-primary" />
            <p className="mt-2 text-muted">{hindi ? 'प्रोफ़ाइल विवरण लोड हो रहा है...' : 'Loading user profile details...'}</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Main Government Form Panel */}
          <div className="panel panel-primary">
            <div className="panel-heading">
              <i className="fa fa-user" /> {hindi ? 'उपयोगकर्ता पंजीकरण एवं संपर्क विवरण' : 'Registered User Profile & Identity Information'}
            </div>

            <div className="panel-body">
              {/* Section 1: Account Credentials */}
              <div className="gov-sub-heading">
                1. {hindi ? 'खाता विवरण' : 'Account Credentials & System Role'}
              </div>
              <div className="row">
                <div className="col-md-4 col-sm-6">
                  <div className="form-group">
                    <label>
                      {hindi ? 'उपयोगकर्ता आईडी' : 'User ID'} <span className="required-star">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.userId}
                      disabled
                    />
                  </div>
                </div>

                <div className="col-md-4 col-sm-6">
                  <div className="form-group">
                    <label>
                      {hindi ? 'प्रणाली भूमिका' : 'Role'} <span className="required-star">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.roleName}
                      disabled
                    />
                  </div>
                </div>

                <div className="col-md-4 col-sm-6">
                  <div className="form-group">
                    <label>{hindi ? 'खाता स्थिति' : 'Account Status'}</label>
                    <div>
                      <span className="label label-success" style={{ fontSize: '12px', padding: '5px 10px', display: 'inline-block' }}>
                        <i className="fa fa-check" /> Active &amp; Verified
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Personal Details */}
              <div className="gov-sub-heading">
                2. {hindi ? 'व्यक्तिगत विवरण' : 'Personal Details'}
              </div>
              <div className="row">
                <div className="col-md-4 col-sm-6">
                  <div className="form-group">
                    <label>
                      {hindi ? 'पहला नाम' : 'First Name'} <span className="required-star">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      className="form-control"
                      value={formData.firstName || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                      required
                    />
                  </div>
                </div>

                <div className="col-md-4 col-sm-6">
                  <div className="form-group">
                    <label>{hindi ? 'मध्य नाम' : 'Middle Name'}</label>
                    <input
                      type="text"
                      name="middleName"
                      className="form-control"
                      value={formData.middleName || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="col-md-4 col-sm-6">
                  <div className="form-group">
                    <label>
                      {hindi ? 'अंतिम नाम' : 'Last Name'} <span className="required-star">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      className="form-control"
                      value={formData.lastName || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-4 col-sm-6">
                  <div className="form-group">
                    <label>
                      {hindi ? "पिता / पति का पहला नाम" : "Father / Husband's First Name"} <span className="required-star">*</span>
                    </label>
                    <input
                      type="text"
                      name="fatherOrHusbandFirstName"
                      className="form-control"
                      value={formData.fatherOrHusbandFirstName || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                      required
                    />
                  </div>
                </div>

                <div className="col-md-4 col-sm-6">
                  <div className="form-group">
                    <label>{hindi ? "पिता / पति का मध्य नाम" : "Father / Husband's Middle Name"}</label>
                    <input
                      type="text"
                      name="fatherOrHusbandMiddleName"
                      className="form-control"
                      value={formData.fatherOrHusbandMiddleName || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="col-md-4 col-sm-6">
                  <div className="form-group">
                    <label>
                      {hindi ? "पिता / पति का अंतिम नाम" : "Father / Husband's Last Name"} <span className="required-star">*</span>
                    </label>
                    <input
                      type="text"
                      name="fatherOrHusbandLastName"
                      className="form-control"
                      value={formData.fatherOrHusbandLastName || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-3 col-sm-6">
                  <div className="form-group">
                    <label>
                      {hindi ? 'जन्म तिथि' : 'Date of Birth'} <span className="required-star">*</span>
                    </label>
                    <input
                      type="date"
                      name="dob"
                      className="form-control"
                      value={formData.dob || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="col-md-3 col-sm-6">
                  <div className="form-group">
                    <label>
                      {hindi ? 'लिंग' : 'Gender'} <span className="required-star">*</span>
                    </label>
                    <select
                      name="genderId"
                      className="form-control"
                      value={formData.genderId}
                      onChange={handleChange}
                      disabled={!isEditing}
                    >
                      <option value="1">Male</option>
                      <option value="2">Female</option>
                      <option value="3">Other</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-3 col-sm-6">
                  <div className="form-group">
                    <label>
                      {hindi ? 'वर्ग / जाति श्रेणी' : 'Category'} <span className="required-star">*</span>
                    </label>
                    <select
                      name="categoryId"
                      className="form-control"
                      value={formData.categoryId}
                      onChange={handleChange}
                      disabled={!isEditing}
                    >
                      <option value="1">General</option>
                      <option value="2">OBC</option>
                      <option value="3">SC</option>
                      <option value="4">ST</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-3 col-sm-6">
                  <div className="form-group">
                    <label>{hindi ? 'धर्म' : 'Religion'}</label>
                    <select
                      name="religion"
                      className="form-control"
                      value={formData.religion}
                      onChange={handleChange}
                      disabled={!isEditing}
                    >
                      <option value="Hinduism">Hinduism</option>
                      <option value="Islam">Islam</option>
                      <option value="Sikhism">Sikhism</option>
                      <option value="Christianity">Christianity</option>
                      <option value="Jainism">Jainism</option>
                      <option value="Buddhism">Buddhism</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {formData.categoryId !== '1' && (
                  <div className="col-md-3 col-sm-6">
                    <div className="form-group">
                      <label style={{ fontSize: '11px' }}>
                        {hindi ? 'जाति प्रमाण पत्र अपलोड (PDF ≤500KB)' : 'Upload Caste Certificate (PDF ≤500KB)'}
                      </label>
                      <input
                        type="file"
                        name="categoryUpload"
                        className="form-control"
                        accept=".pdf,.jpg,.jpeg"
                        onChange={handleFileChange}
                        disabled={!isEditing}
                      />
                      {files.categoryUpload && (
                        <div style={{ fontSize: '11px', color: '#2e7d32', marginTop: '2px' }}>
                          <i className="fa fa-check-circle" /> {files.categoryUpload.name}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <label>
                      {hindi ? 'इकाई / उद्यम का नाम' : 'Name of Unit / Industry'} <span className="required-star">*</span>
                    </label>
                    <input
                      type="text"
                      name="nameOfUnit"
                      maxLength={100}
                      className="form-control"
                      value={formData.nameOfUnit || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder={hindi ? 'इकाई / उद्यम का नाम दर्ज करें' : 'Enter Name of Unit / Industry'}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Domicile, Minority, Disability & Beneficiary */}
              <div className="row" style={{ backgroundColor: '#f9f9f9', padding: '10px 0', margin: '5px 0 15px', border: '1px solid #eee' }}>
                <div className="col-md-3 col-sm-6">
                  <label>
                    {hindi ? 'क्या आप मध्य प्रदेश के मूल निवासी हैं?' : 'Are you a Domicile of M.P.?'} <span className="required-star">*</span>
                  </label>
                  <div style={{ marginTop: '5px' }}>
                    <label className="radio-inline" style={{ marginRight: '15px' }}>
                      <input
                        type="radio"
                        name="domicile"
                        value="Yes"
                        checked={formData.domicile === 'Yes'}
                        onChange={handleChange}
                        disabled={!isEditing}
                      /> Yes
                    </label>
                    <label className="radio-inline">
                      <input
                        type="radio"
                        name="domicile"
                        value="No"
                        checked={formData.domicile === 'No'}
                        onChange={handleChange}
                        disabled={!isEditing}
                      /> No
                    </label>
                  </div>
                </div>

                <div className="col-md-3 col-sm-6">
                  <label>
                    {hindi ? 'क्या आप अल्पसंख्यक वर्ग से हैं?' : 'Do you belong to Minority Category?'} <span className="required-star">*</span>
                  </label>
                  <div style={{ marginTop: '5px' }}>
                    <label className="radio-inline" style={{ marginRight: '15px' }}>
                      <input
                        type="radio"
                        name="minority"
                        value="1"
                        checked={formData.minority === '1'}
                        onChange={handleChange}
                        disabled={!isEditing}
                      /> Yes
                    </label>
                    <label className="radio-inline">
                      <input
                        type="radio"
                        name="minority"
                        value="0"
                        checked={formData.minority === '0'}
                        onChange={handleChange}
                        disabled={!isEditing}
                      /> No
                    </label>
                  </div>
                </div>

                <div className="col-md-3 col-sm-6">
                  <label>
                    {hindi ? 'क्या आप दिव्यांग हैं?' : 'Are you Physically Disabled?'} <span className="required-star">*</span>
                  </label>
                  <div style={{ marginTop: '5px' }}>
                    <label className="radio-inline" style={{ marginRight: '15px' }}>
                      <input
                        type="radio"
                        name="physicallyDisabled"
                        value="1"
                        checked={formData.physicallyDisabled === '1'}
                        onChange={handleChange}
                        disabled={!isEditing}
                      /> Yes
                    </label>
                    <label className="radio-inline">
                      <input
                        type="radio"
                        name="physicallyDisabled"
                        value="0"
                        checked={formData.physicallyDisabled === '0'}
                        onChange={handleChange}
                        disabled={!isEditing}
                      /> No
                    </label>
                  </div>
                </div>

                <div className="col-md-3 col-sm-6">
                  <label>
                    {hindi ? 'अ.जा./अ.ज.जा. लाभ प्राप्त करना चाहते हैं?' : 'Avail SC/ST benefits?'} <span className="required-star">*</span>
                  </label>
                  <div style={{ marginTop: '5px' }}>
                    <label className="radio-inline" style={{ marginRight: '15px' }}>
                      <input
                        type="radio"
                        name="benificiaryUser"
                        value="1"
                        checked={formData.benificiaryUser === '1'}
                        onChange={handleChange}
                        disabled={!isEditing}
                      /> Yes
                    </label>
                    <label className="radio-inline">
                      <input
                        type="radio"
                        name="benificiaryUser"
                        value="0"
                        checked={formData.benificiaryUser === '0'}
                        onChange={handleChange}
                        disabled={!isEditing}
                      /> No
                    </label>
                  </div>
                </div>
              </div>

              {formData.benificiaryUser === '1' && (
                <div className="row" style={{ marginBottom: '10px' }}>
                  <div className="col-md-4 col-sm-6">
                    <div className="form-group">
                      <label>
                        {hindi ? 'समग्र आईडी' : 'Samagra ID'} <span className="required-star">*</span>
                      </label>
                      <input
                        type="text"
                        name="samagraId"
                        maxLength={35}
                        className="form-control"
                        value={formData.samagraId || ''}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder={hindi ? 'समग्र आईडी दर्ज करें' : 'Enter Samagra ID'}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Section 3: Contact Details */}
              <div className="gov-sub-heading">
                3. {hindi ? 'संपर्क विवरण' : 'Communication & Contact Information'}
              </div>
              <div className="row">
                <div className="col-md-3 col-sm-6">
                  <div className="form-group">
                    <label>
                      {hindi ? 'ईमेल आईडी' : 'Email Address'} <span className="required-star">*</span>
                    </label>
                    <input
                      type="email"
                      name="emailId"
                      className="form-control"
                      value={formData.emailId || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                      required
                    />
                  </div>
                </div>

                <div className="col-md-3 col-sm-6">
                  <div className="form-group">
                    <label>
                      {hindi ? 'मोबाइल नंबर' : 'Mobile Number'} <span className="required-star">*</span>
                    </label>
                    <input
                      type="tel"
                      name="mobileNumber"
                      maxLength={10}
                      className="form-control"
                      value={formData.mobileNumber || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                      required
                    />
                  </div>
                </div>

                <div className="col-md-3 col-sm-6">
                  <div className="form-group">
                    <label>{hindi ? 'दूरभाष (Landline)' : 'Telephone Number'}</label>
                    <input
                      type="text"
                      name="telephoneNumber"
                      className="form-control"
                      value={formData.telephoneNumber || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="col-md-3 col-sm-6">
                  <div className="form-group">
                    <label>{hindi ? 'वेबसाइट' : 'Website'}</label>
                    <input
                      type="url"
                      name="website"
                      className="form-control"
                      placeholder="https://example.com"
                      value={formData.website || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Identity & Document Proofs */}
              <div className="gov-sub-heading">
                4. {hindi ? 'पहचान एवं सत्यापन दस्तावेज़' : 'Identity Verification & Statutory Documents'}
              </div>
              <div className="row">
                {/* Aadhaar Number */}
                <div className="col-md-3 col-sm-6">
                  <div className="panel panel-default">
                    <div className="panel-heading" style={{ fontSize: '13px' }}>
                      {hindi ? 'आधार विवरण' : 'Aadhaar Identification'}
                    </div>
                    <div className="panel-body">
                      <div className="form-group">
                        <label>Aadhaar Number (12-digit)</label>
                        <input
                          type="text"
                          name="aadhaarNumber"
                          maxLength={12}
                          className="form-control"
                          value={formData.aadhaarNumber || ''}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 12)
                            setFormData((prev) => ({ ...prev, aadhaarNumber: val }))
                          }}
                          disabled={!isEditing}
                          placeholder="123456789012"
                        />
                      </div>
                      <p style={{ fontSize: '11px', color: '#777', marginTop: '10px' }}>
                        {hindi ? '12 अंकों का वैध आधार नंबर' : 'Valid 12-digit UIDAI number'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* PAN Number */}
                <div className="col-md-3 col-sm-6">
                  <div className="panel panel-default">
                    <div className="panel-heading" style={{ fontSize: '13px' }}>
                      {hindi ? 'पैन कार्ड विवरण' : 'Permanent Account Number (PAN)'} <span className="required-star">*</span>
                    </div>
                    <div className="panel-body">
                      <div className="form-group">
                        <label>PAN No.</label>
                        <input
                          type="text"
                          name="panNo"
                          maxLength={10}
                          className="form-control text-uppercase"
                          value={formData.panNo || ''}
                          onChange={handleChange}
                          disabled={!isEditing}
                          placeholder="ABCDE1234F"
                        />
                      </div>
                      <div className="form-group" style={{ marginTop: '10px' }}>
                        <label style={{ fontSize: '11px', color: '#666' }}>Upload PAN (PDF/JPEG &lt;500KB)</label>
                        <input
                          type="file"
                          name="panUpload"
                          className="form-control"
                          accept=".pdf,.jpg,.jpeg"
                          onChange={handleFileChange}
                          disabled={!isEditing}
                        />
                        {files.panUpload && (
                          <div style={{ fontSize: '11px', color: '#2e7d32', marginTop: '3px' }}>
                            <i className="fa fa-check-circle" /> {files.panUpload.name}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Proof of Identity */}
                <div className="col-md-3 col-sm-6">
                  <div className="panel panel-default">
                    <div className="panel-heading" style={{ fontSize: '13px' }}>
                      {hindi ? 'पहचान का प्रमाण' : 'Proof of Identity (POI)'} <span className="required-star">*</span>
                    </div>
                    <div className="panel-body">
                      <div className="form-group">
                        <label>Document Type</label>
                        <select
                          name="proofOfIdentity"
                          className="form-control"
                          value={formData.proofOfIdentity}
                          onChange={handleChange}
                          disabled={!isEditing}
                        >
                          <option value="Aadhaar Card">Aadhaar Card</option>
                          <option value="Voter ID">Voter ID Card</option>
                          <option value="Passport">Passport</option>
                          <option value="Driving License">Driving License</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Document Number</label>
                        <input
                          type="text"
                          name="proofOfIdentityNo"
                          className="form-control"
                          value={formData.proofOfIdentityNo || ''}
                          onChange={handleChange}
                          disabled={!isEditing}
                          placeholder="ID Number"
                        />
                      </div>
                      <div className="form-group" style={{ marginTop: '10px' }}>
                        <label style={{ fontSize: '11px', color: '#666' }}>Upload POI (PDF/JPEG &lt;500KB)</label>
                        <input
                          type="file"
                          name="proofOfIdentityUpload"
                          className="form-control"
                          accept=".pdf,.jpg,.jpeg"
                          onChange={handleFileChange}
                          disabled={!isEditing}
                        />
                        {files.proofOfIdentityUpload && (
                          <div style={{ fontSize: '11px', color: '#2e7d32', marginTop: '3px' }}>
                            <i className="fa fa-check-circle" /> {files.proofOfIdentityUpload.name}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Proof of Address */}
                <div className="col-md-3 col-sm-6">
                  <div className="panel panel-default">
                    <div className="panel-heading" style={{ fontSize: '13px' }}>
                      {hindi ? 'पते का प्रमाण' : 'Proof of Address (POA)'} <span className="required-star">*</span>
                    </div>
                    <div className="panel-body">
                      <div className="form-group">
                        <label>Document Type</label>
                        <select
                          name="proofOfAddress"
                          className="form-control"
                          value={formData.proofOfAddress}
                          onChange={handleChange}
                          disabled={!isEditing}
                        >
                          <option value="Electricity Bill">Electricity Bill</option>
                          <option value="Telephone Bill">Telephone Bill</option>
                          <option value="Ration Card">Ration Card</option>
                          <option value="Bank Passbook">Bank Passbook</option>
                        </select>
                      </div>
                      <div className="form-group" style={{ marginTop: '10px' }}>
                        <label style={{ fontSize: '11px', color: '#666' }}>Upload POA (PDF/JPEG &lt;500KB)</label>
                        <input
                          type="file"
                          name="proofOfAddressUpload"
                          className="form-control"
                          accept=".pdf,.jpg,.jpeg"
                          onChange={handleFileChange}
                          disabled={!isEditing}
                        />
                        {files.proofOfAddressUpload && (
                          <div style={{ fontSize: '11px', color: '#2e7d32', marginTop: '3px' }}>
                            <i className="fa fa-check-circle" /> {files.proofOfAddressUpload.name}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 5: Present Address */}
              <div className="gov-sub-heading">
                5. {hindi ? 'वर्तमान निवास का पता' : 'Present Residential Address'}
              </div>
              <div className="row">
                <div className="col-md-4 col-sm-6">
                  <div className="form-group">
                    <label>
                      Address Line 1 <span className="required-star">*</span>
                    </label>
                    <input
                      type="text"
                      name="address1"
                      className="form-control"
                      value={formData.address1 || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                      required
                    />
                  </div>
                </div>

                <div className="col-md-4 col-sm-6">
                  <div className="form-group">
                    <label>Address Line 2</label>
                    <input
                      type="text"
                      name="address2"
                      className="form-control"
                      value={formData.address2 || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="col-md-4 col-sm-6">
                  <div className="form-group">
                    <label>City / Town</label>
                    <input
                      type="text"
                      name="city"
                      className="form-control"
                      value={formData.city || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-2 col-sm-4">
                  <div className="form-group">
                    <label>State</label>
                    <input type="text" className="form-control" value="Madhya Pradesh" disabled />
                  </div>
                </div>

                <div className="col-md-3 col-sm-4">
                  <div className="form-group">
                    <label>District</label>
                    <input
                      type="text"
                      name="districtId"
                      className="form-control"
                      value={formData.districtId || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="col-md-3 col-sm-4">
                  <div className="form-group">
                    <label>Tehsil</label>
                    <input
                      type="text"
                      name="tehsilId"
                      className="form-control"
                      value={formData.tehsilId || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="col-md-2 col-sm-6">
                  <div className="form-group">
                    <label>Block</label>
                    <input
                      type="text"
                      name="blockId"
                      className="form-control"
                      value={formData.blockId || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="col-md-2 col-sm-6">
                  <div className="form-group">
                    <label>
                      Pincode <span className="required-star">*</span>
                    </label>
                    <input
                      type="text"
                      name="pinCode"
                      maxLength={6}
                      className="form-control"
                      value={formData.pinCode || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Section 6: Permanent Address */}
              <div className="gov-sub-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>6. {hindi ? 'स्थाई पता' : 'Permanent Residential Address'}</span>
                {isEditing && (
                  <label style={{ margin: 0, textTransform: 'none', fontWeight: 'normal', fontSize: '12px', cursor: 'pointer', color: '#337ab7' }}>
                    <input
                      type="checkbox"
                      name="sameAsPresent"
                      checked={formData.sameAsPresent}
                      onChange={handleChange}
                      style={{ marginRight: '5px' }}
                    />
                    {hindi ? 'वर्तमान पते के समान' : 'Same as Present Address'}
                  </label>
                )}
              </div>

              <div className="row">
                <div className="col-md-4 col-sm-6">
                  <div className="form-group">
                    <label>Permanent Address 1</label>
                    <input
                      type="text"
                      name="permanentAddress1"
                      className="form-control"
                      value={formData.permanentAddress1 || ''}
                      onChange={handleChange}
                      disabled={!isEditing || formData.sameAsPresent}
                    />
                  </div>
                </div>

                <div className="col-md-4 col-sm-6">
                  <div className="form-group">
                    <label>Permanent Address 2</label>
                    <input
                      type="text"
                      name="permanentAddress2"
                      className="form-control"
                      value={formData.permanentAddress2 || ''}
                      onChange={handleChange}
                      disabled={!isEditing || formData.sameAsPresent}
                    />
                  </div>
                </div>

                <div className="col-md-4 col-sm-6">
                  <div className="form-group">
                    <label>Permanent City / Town</label>
                    <input
                      type="text"
                      name="permanentCity"
                      className="form-control"
                      value={formData.permanentCity || ''}
                      onChange={handleChange}
                      disabled={!isEditing || formData.sameAsPresent}
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-2 col-sm-4">
                  <div className="form-group">
                    <label>State</label>
                    <input type="text" className="form-control" value="Madhya Pradesh" disabled />
                  </div>
                </div>

                <div className="col-md-3 col-sm-4">
                  <div className="form-group">
                    <label>District</label>
                    <input
                      type="text"
                      name="permanentDistrictId"
                      className="form-control"
                      value={formData.permanentDistrictId || ''}
                      onChange={handleChange}
                      disabled={!isEditing || formData.sameAsPresent}
                    />
                  </div>
                </div>

                <div className="col-md-3 col-sm-4">
                  <div className="form-group">
                    <label>Tehsil</label>
                    <input
                      type="text"
                      name="permanentTehsilName"
                      className="form-control"
                      value={formData.permanentTehsilName || ''}
                      onChange={handleChange}
                      disabled={!isEditing || formData.sameAsPresent}
                    />
                  </div>
                </div>

                <div className="col-md-2 col-sm-6">
                  <div className="form-group">
                    <label>Block</label>
                    <input
                      type="text"
                      name="permanentBlockName"
                      className="form-control"
                      value={formData.permanentBlockName || ''}
                      onChange={handleChange}
                      disabled={!isEditing || formData.sameAsPresent}
                    />
                  </div>
                </div>

                <div className="col-md-2 col-sm-6">
                  <div className="form-group">
                    <label>Pincode</label>
                    <input
                      type="text"
                      name="permanentPinCode"
                      maxLength={6}
                      className="form-control"
                      value={formData.permanentPinCode || ''}
                      onChange={handleChange}
                      disabled={!isEditing || formData.sameAsPresent}
                    />
                  </div>
                </div>
              </div>

              {/* Form Action Controls */}
              {isEditing && (
                <div className="text-right" style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #e5e5e5' }}>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="btn btn-default"
                    style={{ marginRight: '10px' }}
                  >
                    {hindi ? 'रद्द करें' : 'Cancel'}
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-success"
                  >
                    {submitting ? (
                      <>
                        <i className="fa fa-spinner fa-spin" /> {hindi ? 'सहेज रहे हैं...' : 'Saving Changes...'}
                      </>
                    ) : (
                      <>
                        <i className="fa fa-save" /> {hindi ? 'परिवर्तन सहेजें' : 'Update Profile'}
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </form>
      )}
    </div>
  )
}
