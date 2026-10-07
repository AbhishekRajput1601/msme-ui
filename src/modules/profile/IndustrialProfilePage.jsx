import React, { useState, useEffect } from 'react'
import { useTranslation } from '../../hooks/useTranslation'
import { useAuth } from '../../hooks/useAuth'
import ProfileNavTabs from './components/ProfileNavTabs'
import {
  fetchIndustrialProfile,
  updateIndustrialProfile,
  updateIndustrialPartners,
  updateIndustrialRegNocs,
} from './services/profileService'

export default function IndustrialProfilePage() {
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
    firmConstitution: 'Proprietorship',
    indOrgName: '',
    firmSector: 'Manufacturing',
    hasUdyam: false,
    udyamRegNo: '',
    udyamRegDate: '',
    firmCategory: 'Micro',
    statusOfPremises: 'Owned',
    panNo: '',
    tanNo: '',
    gstNo: '',
    // POA / Authorized Person
    poaFirstName: '',
    poaLastName: '',
    poaFatherName: '',
    poaDob: '',
    poaGender: '1',
    poaCategory: '1',
    // Licenses
    factoryActLicNo: '',
    factoryActLicNoDoi: '',
    factoryActLicNoValidUpto: '',
    cin: '',
    cinDoi: '',
    pcbRegNoEstablished: '',
    pcbRegNoEstablishedDoi: '',
    pcbRegNoEstablishedValidUpto: '',
    pcbRegNoOperate: '',
    pcbRegNoOperateDoi: '',
    pcbRegNoOperateValidUpto: '',
    // Unit Address
    address1: '',
    address2: '',
    address3: '',
    stateId: '20',
    districtId: 'Bhopal',
    tehsilId: 'Huzur',
    blockId: 'Phanda',
    pinCode: '',
    unitInIndustrialArea: 'No',
    industrialArea: '',
    plotNos: '',
    areaInSqm: '',
    presentAddMobileNo: '',
    presentAddTelephoneNo: '',
    proofOfAddress: 'Electricity Bill',
    // Registered / Office Address
    sameAsAbovecheck: false,
    permanentAddress1: '',
    permanentAddress2: '',
    permanentAddress3: '',
    permanentStateId: '20',
    permanentDistrictId: 'Bhopal',
    permanentTehsilId: 'Huzur',
    permanentBlockId: 'Phanda',
    permanentPinCode: '',
    permanentAddMobileNo: '',
    permanentAddTelephoneNo: '',
    // Bank Details
    bankName: 'State Bank of India',
    otherBankName: '',
    bankAccountName: '',
    accountNumber: '',
    ifsc: '',
  })

  const [partnersList, setPartnersList] = useState([
    {
      name: '',
      fatherName: '',
      dob: '',
      gender: '1',
      category: '1',
      categoryNo: '',
      idProof: 'Aadhaar Card',
      idProofNo: '',
      mobileNo: '',
      sharePercentage: '100',
      designation: 'Proprietor',
    },
  ])

  const [regNocList, setRegNocList] = useState([])

  const [files, setFiles] = useState({
    panUpload: null,
    tanUpload: null,
    gstUpload: null,
    udyamUpload: null,
    deedUpload: null,
    aoaUpload: null,
    moaUpload: null,
    cinUpload: null,
    factoryUpload: null,
    pcbEstUpload: null,
    pcbOperateUpload: null,
    proofOfAddressUpload: null,
    categoryUpload: null,
    proofOfIdentityUpload: null,
    cancelledChequeUpload: null,
    specimenSignUpload: null,
    poaDocUpload: null,
  })

  useEffect(() => {
    let active = true
    setLoading(true)
    fetchIndustrialProfile()
      .then((data) => {
        if (!active) return
        if (data) {
          setFormData((prev) => ({
            ...prev,
            ...data,
            userId: data.userId || currentUser?.username || 'APPLICANT',
            roleName: data.roleName || 'ROLE_APPLICANT',
            firmConstitution: data.firmConstitution || 'Proprietorship',
            firmSector: data.firmSector || 'Manufacturing',
            firmCategory: data.firmCategory || 'Micro',
            statusOfPremises: data.statusOfPremises || 'Owned',
            unitInIndustrialArea: data.industrialArea ? 'Yes' : 'No',
            sameAsAbovecheck: data.sameAsAbovecheck || false,
            permanentAddress1: data.permanentAddress1 || '',
            permanentAddress2: data.permanentAddress2 || '',
            permanentAddress3: data.permanentAddress3 || '',
            permanentStateId: data.permanentStateId || '20',
            permanentDistrictId: data.permanentDistrictId || 'Bhopal',
            permanentTehsilId: data.permanentTehsilId || 'Huzur',
            permanentBlockId: data.permanentBlockId || 'Phanda',
            permanentPinCode: data.permanentPinCode || '',
            permanentAddMobileNo: data.permanentAddMobileNo || '',
            permanentAddTelephoneNo: data.permanentAddTelephoneNo || '',
          }))
          if (Array.isArray(data.industrialPartnerslist) && data.industrialPartnerslist.length > 0) {
            setPartnersList(data.industrialPartnerslist)
          }
          if (Array.isArray(data.regNocList)) {
            setRegNocList(data.regNocList)
          }
        }
      })
      .catch((err) => {
        if (active) {
          setErrorMessage(err.message || 'Could not load industrial profile.')
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
    if (name === 'sameAsAbovecheck') {
      const isChecked = type === 'checkbox' ? checked : value
      setFormData((prev) => ({
        ...prev,
        sameAsAbovecheck: isChecked,
        ...(isChecked
          ? {
            permanentAddress1: prev.address1,
            permanentAddress2: prev.address2,
            permanentAddress3: prev.address3,
            permanentStateId: prev.stateId,
            permanentDistrictId: prev.districtId,
            permanentTehsilId: prev.tehsilId,
            permanentBlockId: prev.blockId,
            permanentPinCode: prev.pinCode,
            permanentAddMobileNo: prev.presentAddMobileNo,
            permanentAddTelephoneNo: prev.presentAddTelephoneNo,
          }
          : {}),
      }))
      return
    }

    setFormData((prev) => {
      const next = { ...prev, [name]: type === 'checkbox' ? checked : value }
      if (prev.sameAsAbovecheck && (name.startsWith('address') || name === 'pinCode')) {
        if (name === 'address1') next.permanentAddress1 = value
        if (name === 'address2') next.permanentAddress2 = value
        if (name === 'address3') next.permanentAddress3 = value
        if (name === 'pinCode') next.permanentPinCode = value
      }
      return next
    })
  }

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target
    if (selectedFiles && selectedFiles[0]) {
      const file = selectedFiles[0]
      // 5MB limit for PCB uploads, 2MB for Udyam, 500KB default
      const isLargeDoc = name.includes('pcb') || name.includes('UploadId')
      const maxLimit = isLargeDoc ? 5 * 1024 * 1024 : 2 * 1024 * 1024
      if (file.size > maxLimit) {
        alert(hindi ? `फ़ाइल का आकार ${isLargeDoc ? '5MB' : '2MB'} से अधिक नहीं होना चाहिए।` : `File size should not exceed ${isLargeDoc ? '5MB' : '2MB'}.`)
        e.target.value = ''
        return
      }
      setFiles((prev) => ({ ...prev, [name]: file }))
    }
  }

  const handlePartnerChange = (index, field, value) => {
    setPartnersList((prev) => {
      const copy = [...prev]
      copy[index] = { ...copy[index], [field]: value }
      return copy
    })
  }

  const addPartner = () => {
    setPartnersList((prev) => [
      ...prev,
      {
        name: '',
        fatherName: '',
        dob: '',
        gender: '1',
        category: '1',
        categoryNo: '',
        idProof: 'Aadhaar Card',
        idProofNo: '',
        mobileNo: '',
        sharePercentage: '',
        designation: '',
      },
    ])
  }

  const removePartner = (index) => {
    if (partnersList.length <= 1) {
      alert(hindi ? 'कम से कम एक सदस्य आवश्यक है।' : 'At least one partner/member is required.')
      return
    }
    setPartnersList((prev) => prev.filter((_, i) => i !== index))
  }

  const addRegNoc = () => {
    setRegNocList((prev) => [
      ...prev,
      {
        certiType: '',
        certiNo: '',
        certiValidUpto: '',
      },
    ])
  }

  const removeRegNoc = (index) => {
    setRegNocList((prev) => prev.filter((_, i) => i !== index))
  }

  const handleRegNocChange = (index, field, value) => {
    setRegNocList((prev) => {
      const copy = [...prev]
      copy[index] = { ...copy[index], [field]: value }
      return copy
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage(null)
    setErrorMessage(null)

    if (!formData.indOrgName) {
      setErrorMessage(hindi ? 'कृपया उद्योग / इकाई का नाम दर्ज करें।' : 'Please enter enterprise / unit name.')
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

      const res = await updateIndustrialProfile(dataPayload)

      // Update partners
      if (formData.userId && partnersList.length > 0) {
        await updateIndustrialPartners(formData.userId, partnersList)
      }

      // Update NOCs
      if (formData.userId && regNocList.length > 0) {
        await updateIndustrialRegNocs(formData.userId, regNocList)
      }

      setMessage(res.successMessage || (hindi ? 'औद्योगिक प्रोफ़ाइल सफलतापूर्वक अपडेट की गई।' : 'Industrial profile updated successfully.'))
      setIsEditing(false)
    } catch (err) {
      setErrorMessage(err.message || (hindi ? 'औद्योगिक प्रोफ़ाइल अपडेट करने में त्रुटि।' : 'Failed to update industrial profile.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="profile-page-container">
      {/* Top Tab Navigation & Breadcrumbs */}
      <ProfileNavTabs activeTab="industry" pageTitle={hindi ? 'औद्योगिक प्रोफ़ाइल' : 'Industrial Profile Management'} />

      {/* Legacy Government Form Banner */}
      <div className="gov-form-banner">
        <div className="gov-form-banner-title">
          <h2>{hindi ? 'औद्योगिक प्रोफ़ाइल विवरण' : 'Update Industrial Enterprise Profile'}</h2>
          <p>{hindi ? 'मध्य प्रदेश शासन — सूक्ष्म, लघु एवं मध्यम उद्यम विभाग' : 'Government of Madhya Pradesh — Department of MSME'}</p>
        </div>

        <div>
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="btn btn-warning"
            >
              <i className="fa fa-pencil" /> {hindi ? 'प्रोफ़ाइल संपादित करें' : 'Edit Industrial Profile'}
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
            <p className="mt-2 text-muted">{hindi ? 'औद्योगिक प्रोफ़ाइल लोड हो रही है...' : 'Loading industrial profile...'}</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Main Government Form Panel */}
          <div className="panel panel-primary">
            <div className="panel-heading">
              <i className="fa fa-industry" /> {hindi ? 'औद्योगिक इकाई एवं विनियामक जानकारी' : 'Industrial Information & Organization Profile'}
            </div>

            <div className="panel-body">
              {/* Section 1: Organization Details */}
              <div className="gov-sub-heading">
                1. {hindi ? 'इकाई का गठन एवं उद्यम विवरण' : 'Enterprise Constitution & Category'}
              </div>

              <div className="row">
                <div className="col-md-4 col-sm-6">
                  <div className="form-group">
                    <label>
                      {hindi ? 'फर्म / इकाई का गठन' : 'Constitution of Firm / Company'} <span className="required-star">*</span>
                    </label>
                    <select
                      name="firmConstitution"
                      className="form-control"
                      value={formData.firmConstitution}
                      onChange={handleChange}
                      disabled={!isEditing}
                    >
                      <option value="Proprietorship">Proprietorship</option>
                      <option value="Partnership">Partnership Firm</option>
                      <option value="Private Limited">Private Limited Company</option>
                      <option value="Public Limited">Public Limited Company</option>
                      <option value="Limited Liability Partnership">Limited Liability Partnership (LLP)</option>
                      <option value="Society/Trust">Society / Trust</option>
                      <option value="HUF">Hindu Undivided Family (HUF)</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-8 col-sm-6">
                  <div className="form-group">
                    <label>
                      {hindi ? 'फर्म / इकाई का नाम' : 'Name of Enterprise / Firm / Unit'} <span className="required-star">*</span>
                    </label>
                    <input
                      type="text"
                      name="indOrgName"
                      className="form-control"
                      value={formData.indOrgName || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                      required
                      placeholder="Enterprise Name"
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-4 col-sm-6">
                  <div className="form-group">
                    <label>
                      {hindi ? 'उद्योग का क्षेत्र' : 'Sector of Industry'} <span className="required-star">*</span>
                    </label>
                    <select
                      name="firmSector"
                      className="form-control"
                      value={formData.firmSector}
                      onChange={handleChange}
                      disabled={!isEditing}
                    >
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Service">Service</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-4 col-sm-6">
                  <div className="form-group">
                    <label>
                      {hindi ? 'एमएसएमई श्रेणी' : 'MSME Category'} <span className="required-star">*</span>
                    </label>
                    <select
                      name="firmCategory"
                      className="form-control"
                      value={formData.firmCategory}
                      onChange={handleChange}
                      disabled={!isEditing}
                    >
                      <option value="Micro">Micro Enterprise (&lt;1 Cr Investment, &lt;5 Cr Turnover)</option>
                      <option value="Small">Small Enterprise (&lt;10 Cr Investment, &lt;50 Cr Turnover)</option>
                      <option value="Medium">Medium Enterprise (&lt;50 Cr Investment, &lt;250 Cr Turnover)</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-4 col-sm-6">
                  <div className="form-group">
                    <label>{hindi ? 'परिसर की स्थिति' : 'Status of Premises'}</label>
                    <select
                      name="statusOfPremises"
                      className="form-control"
                      value={formData.statusOfPremises}
                      onChange={handleChange}
                      disabled={!isEditing}
                    >
                      <option value="Owned">Owned</option>
                      <option value="Leased">Leased</option>
                      <option value="Rented">Rented</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Udyam & Tax Registration Box */}
              <div style={{ backgroundColor: '#fdfbf7', border: '1px solid #ebd3be', padding: '15px', margin: '15px 0', borderRadius: '4px' }}>
                <div className="checkbox" style={{ marginTop: 0, marginBottom: '12px' }}>
                  <label style={{ fontWeight: 'bold', color: '#8a3b14' }}>
                    <input
                      type="checkbox"
                      name="hasUdyam"
                      checked={formData.hasUdyam}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                    {hindi ? 'उद्यम पंजीकरण प्रमाणपत्र उपलब्ध है (Udyam Registration)' : 'Possesses Udyam Registration Certificate'}
                  </label>
                </div>

                {formData.hasUdyam && (
                  <div className="row">
                    <div className="col-md-4 col-sm-6">
                      <div className="form-group">
                        <label>Udyam Registration No.</label>
                        <input
                          type="text"
                          name="udyamRegNo"
                          className="form-control text-uppercase"
                          value={formData.udyamRegNo || ''}
                          onChange={handleChange}
                          disabled={!isEditing}
                          placeholder="UDYAM-MP-00-0000000"
                        />
                      </div>
                    </div>

                    <div className="col-md-4 col-sm-6">
                      <div className="form-group">
                        <label>Date of Registration</label>
                        <input
                          type="date"
                          name="udyamRegDate"
                          className="form-control"
                          value={formData.udyamRegDate || ''}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="col-md-4 col-sm-12">
                      <div className="form-group">
                        <label>Upload Udyam Certificate (PDF/JPEG &lt;500KB)</label>
                        <input
                          type="file"
                          name="udyamUpload"
                          className="form-control"
                          accept=".pdf,.jpg,.jpeg"
                          onChange={handleFileChange}
                          disabled={!isEditing}
                        />
                        {files.udyamUpload && (
                          <div style={{ fontSize: '11px', color: '#2e7d32', marginTop: '3px' }}>
                            <i className="fa fa-check-circle" /> {files.udyamUpload.name}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="row" style={{ paddingTop: '10px', borderTop: '1px dashed #dcdcdc' }}>
                  <div className="col-md-4 col-sm-6">
                    <div className="form-group">
                      <label>
                        Enterprise PAN No. <span className="required-star">*</span>
                      </label>
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
                      <div style={{ marginTop: '5px' }}>
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

                  <div className="col-md-4 col-sm-6">
                    <div className="form-group">
                      <label>TAN Number</label>
                      <input
                        type="text"
                        name="tanNo"
                        maxLength={10}
                        className="form-control text-uppercase"
                        value={formData.tanNo || ''}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="BLRP00000A"
                      />
                      <div style={{ marginTop: '5px' }}>
                        <input
                          type="file"
                          name="tanUpload"
                          className="form-control"
                          accept=".pdf,.jpg,.jpeg"
                          onChange={handleFileChange}
                          disabled={!isEditing}
                        />
                        {files.tanUpload && (
                          <div style={{ fontSize: '11px', color: '#2e7d32', marginTop: '3px' }}>
                            <i className="fa fa-check-circle" /> {files.tanUpload.name}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4 col-sm-6">
                    <div className="form-group">
                      <label>GSTIN Number</label>
                      <input
                        type="text"
                        name="gstNo"
                        maxLength={15}
                        className="form-control text-uppercase"
                        value={formData.gstNo || ''}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="23AAAAA0000A1Z5"
                      />
                      <div style={{ marginTop: '5px' }}>
                        <input
                          type="file"
                          name="gstUpload"
                          className="form-control"
                          accept=".pdf,.jpg,.jpeg"
                          onChange={handleFileChange}
                          disabled={!isEditing}
                        />
                        {files.gstUpload && (
                          <div style={{ fontSize: '11px', color: '#2e7d32', marginTop: '3px' }}>
                            <i className="fa fa-check-circle" /> {files.gstUpload.name}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Partners / Directors List */}
              <div className="gov-sub-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>2. {hindi ? 'साझेदार / सदस्य / निदेशक सूची' : 'List of Partners / Members / Directors'}</span>
                {isEditing && (
                  <button
                    type="button"
                    onClick={addPartner}
                    className="btn btn-primary btn-sm"
                  >
                    <i className="fa fa-plus" /> {hindi ? 'सदस्य जोड़ें' : 'Add Member'}
                  </button>
                )}
              </div>

              <div className="table-responsive">
                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th style={{ width: '40px', textAlign: 'center' }}>S.No</th>
                      <th>Partner Name</th>
                      <th>Father's Name</th>
                      <th style={{ width: '85px' }}>Gender</th>
                      <th style={{ width: '90px' }}>Category</th>
                      <th style={{ width: '130px' }}>Caste Cert No</th>
                      <th>ID Proof No</th>
                      <th>Mobile</th>
                      <th style={{ width: '75px' }}>Share %</th>
                      <th>Designation</th>
                      {isEditing && <th style={{ width: '50px', textAlign: 'center' }}>Action</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {partnersList.map((partner, idx) => (
                      <tr key={idx}>
                        <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{idx + 1}</td>
                        <td>
                          <input
                            type="text"
                            className="form-control input-sm"
                            value={partner.name || ''}
                            onChange={(e) => handlePartnerChange(idx, 'name', e.target.value)}
                            disabled={!isEditing}
                            placeholder="Name"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control input-sm"
                            value={partner.fatherName || ''}
                            onChange={(e) => handlePartnerChange(idx, 'fatherName', e.target.value)}
                            disabled={!isEditing}
                            placeholder="Father Name"
                          />
                        </td>
                        <td>
                          <select
                            className="form-control input-sm"
                            value={partner.gender || '1'}
                            onChange={(e) => handlePartnerChange(idx, 'gender', e.target.value)}
                            disabled={!isEditing}
                          >
                            <option value="1">Male</option>
                            <option value="2">Female</option>
                            <option value="3">Other</option>
                          </select>
                        </td>
                        <td>
                          <select
                            className="form-control input-sm"
                            value={partner.category || '1'}
                            onChange={(e) => handlePartnerChange(idx, 'category', e.target.value)}
                            disabled={!isEditing}
                          >
                            <option value="1">General</option>
                            <option value="2">OBC</option>
                            <option value="3">SC</option>
                            <option value="4">ST</option>
                          </select>
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control input-sm"
                            value={partner.categoryNo || ''}
                            onChange={(e) => handlePartnerChange(idx, 'categoryNo', e.target.value)}
                            disabled={!isEditing || partner.category === '1'}
                            placeholder={partner.category !== '1' ? 'Cert No *' : 'N/A (Gen)'}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control input-sm"
                            value={partner.idProofNo || ''}
                            onChange={(e) => handlePartnerChange(idx, 'idProofNo', e.target.value)}
                            disabled={!isEditing}
                            placeholder="ID Proof No"
                          />
                        </td>
                        <td>
                          <input
                            type="tel"
                            maxLength={10}
                            className="form-control input-sm"
                            value={partner.mobileNo || ''}
                            onChange={(e) => handlePartnerChange(idx, 'mobileNo', e.target.value)}
                            disabled={!isEditing}
                            placeholder="Mobile"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            className="form-control input-sm text-right"
                            value={partner.sharePercentage || ''}
                            onChange={(e) => handlePartnerChange(idx, 'sharePercentage', e.target.value)}
                            disabled={!isEditing}
                            placeholder="%"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control input-sm"
                            value={partner.designation || ''}
                            onChange={(e) => handlePartnerChange(idx, 'designation', e.target.value)}
                            disabled={!isEditing}
                            placeholder="Designation"
                          />
                        </td>
                        {isEditing && (
                          <td style={{ textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => removePartner(idx)}
                              className="btn btn-danger btn-xs"
                              title="Delete row"
                            >
                              <i className="fa fa-trash" />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Member Document Uploads */}
              <div className="panel panel-default" style={{ marginTop: '12px' }}>
                <div className="panel-heading" style={{ fontSize: '12px', fontWeight: 'bold' }}>
                  <i className="fa fa-paperclip" /> {hindi ? 'सदस्य / साझेदार सत्यापन दस्तावेज़' : 'Partner / Member Statutory Documents Upload'}
                </div>
                <div className="panel-body">
                  <div className="row">
                    <div className="col-md-4 col-sm-6">
                      <div className="form-group">
                        <label style={{ fontSize: '11px' }}>
                          {hindi ? 'जाति प्रमाण पत्र (SC/ST/OBC)' : 'Caste Certificates (SC/ST/OBC Partners)'}
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
                          <div style={{ fontSize: '11px', color: '#2e7d32', marginTop: '3px' }}>
                            <i className="fa fa-check-circle" /> {files.categoryUpload.name}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4 col-sm-6">
                      <div className="form-group">
                        <label style={{ fontSize: '11px' }}>
                          {hindi ? 'पहचान प्रमाण (POI Docs)' : 'Proof of Identity (All Partners)'}
                        </label>
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
                    {(formData.firmConstitution?.includes('Partnership') || formData.firmConstitution?.includes('LLP')) && (
                      <div className="col-md-4 col-sm-6">
                        <div className="form-group">
                          <label style={{ fontSize: '11px' }}>
                            {hindi ? 'साझेदारी विलेख (Deed Document)' : 'Partnership / LLP Deed Upload'}
                          </label>
                          <input
                            type="file"
                            name="deedUpload"
                            className="form-control"
                            accept=".pdf,.jpg,.jpeg"
                            onChange={handleFileChange}
                            disabled={!isEditing}
                          />
                          {files.deedUpload && (
                            <div style={{ fontSize: '11px', color: '#2e7d32', marginTop: '3px' }}>
                              <i className="fa fa-check-circle" /> {files.deedUpload.name}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 3: Statutory Licenses */}
              <div className="gov-sub-heading">
                3. {hindi ? 'लाइसेंस एवं विनियामक अनुमतियां' : 'Statutory Licenses & Regulatory Clearances'}
              </div>
              <div className="row">
                <div className="col-md-3 col-sm-6">
                  <div className="panel panel-default">
                    <div className="panel-heading" style={{ fontSize: '13px' }}>Factory Act License</div>
                    <div className="panel-body">
                      <div className="form-group">
                        <label>License No.</label>
                        <input
                          type="text"
                          name="factoryActLicNo"
                          className="form-control input-sm"
                          value={formData.factoryActLicNo || ''}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="row">
                        <div className="col-xs-6">
                          <label style={{ fontSize: '11px' }}>Issue Date</label>
                          <input
                            type="date"
                            name="factoryActLicNoDoi"
                            className="form-control input-sm"
                            value={formData.factoryActLicNoDoi || ''}
                            onChange={handleChange}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="col-xs-6">
                          <label style={{ fontSize: '11px' }}>Valid Upto</label>
                          <input
                            type="date"
                            name="factoryActLicNoValidUpto"
                            className="form-control input-sm"
                            value={formData.factoryActLicNoValidUpto || ''}
                            onChange={handleChange}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      <div style={{ marginTop: '10px' }}>
                        <label style={{ fontSize: '11px', color: '#666' }}>Upload License (PDF &lt;2MB)</label>
                        <input
                          type="file"
                          name="factoryUpload"
                          className="form-control"
                          accept=".pdf,.jpg,.jpeg"
                          onChange={handleFileChange}
                          disabled={!isEditing}
                        />
                        {files.factoryUpload && (
                          <div style={{ fontSize: '11px', color: '#2e7d32', marginTop: '2px' }}>
                            <i className="fa fa-check-circle" /> {files.factoryUpload.name}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-3 col-sm-6">
                  <div className="panel panel-default">
                    <div className="panel-heading" style={{ fontSize: '13px' }}>PCB Consent to Establish (CTE)</div>
                    <div className="panel-body">
                      <div className="form-group">
                        <label>CTE Registration No.</label>
                        <input
                          type="text"
                          name="pcbRegNoEstablished"
                          className="form-control input-sm"
                          value={formData.pcbRegNoEstablished || ''}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="row">
                        <div className="col-xs-6">
                          <label style={{ fontSize: '11px' }}>Issue Date</label>
                          <input
                            type="date"
                            name="pcbRegNoEstablishedDoi"
                            className="form-control input-sm"
                            value={formData.pcbRegNoEstablishedDoi || ''}
                            onChange={handleChange}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="col-xs-6">
                          <label style={{ fontSize: '11px' }}>Valid Upto</label>
                          <input
                            type="date"
                            name="pcbRegNoEstablishedValidUpto"
                            className="form-control input-sm"
                            value={formData.pcbRegNoEstablishedValidUpto || ''}
                            onChange={handleChange}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      <div style={{ marginTop: '10px' }}>
                        <label style={{ fontSize: '11px', color: '#666' }}>Upload CTE Consent (PDF &le;5MB)</label>
                        <input
                          type="file"
                          name="pcbEstUpload"
                          className="form-control"
                          accept=".pdf,.jpg,.jpeg"
                          onChange={handleFileChange}
                          disabled={!isEditing}
                        />
                        {files.pcbEstUpload && (
                          <div style={{ fontSize: '11px', color: '#2e7d32', marginTop: '2px' }}>
                            <i className="fa fa-check-circle" /> {files.pcbEstUpload.name}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-3 col-sm-6">
                  <div className="panel panel-default">
                    <div className="panel-heading" style={{ fontSize: '13px' }}>PCB Consent to Operate (CTO)</div>
                    <div className="panel-body">
                      <div className="form-group">
                        <label>CTO Registration No.</label>
                        <input
                          type="text"
                          name="pcbRegNoOperate"
                          className="form-control input-sm"
                          value={formData.pcbRegNoOperate || ''}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="row">
                        <div className="col-xs-6">
                          <label style={{ fontSize: '11px' }}>Issue Date</label>
                          <input
                            type="date"
                            name="pcbRegNoOperateDoi"
                            className="form-control input-sm"
                            value={formData.pcbRegNoOperateDoi || ''}
                            onChange={handleChange}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="col-xs-6">
                          <label style={{ fontSize: '11px' }}>Valid Upto</label>
                          <input
                            type="date"
                            name="pcbRegNoOperateValidUpto"
                            className="form-control input-sm"
                            value={formData.pcbRegNoOperateValidUpto || ''}
                            onChange={handleChange}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      <div style={{ marginTop: '10px' }}>
                        <label style={{ fontSize: '11px', color: '#666' }}>Upload CTO Consent (PDF &le;5MB)</label>
                        <input
                          type="file"
                          name="pcbOperateUpload"
                          className="form-control"
                          accept=".pdf,.jpg,.jpeg"
                          onChange={handleFileChange}
                          disabled={!isEditing}
                        />
                        {files.pcbOperateUpload && (
                          <div style={{ fontSize: '11px', color: '#2e7d32', marginTop: '2px' }}>
                            <i className="fa fa-check-circle" /> {files.pcbOperateUpload.name}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-3 col-sm-6">
                  <div className="panel panel-default">
                    <div className="panel-heading" style={{ fontSize: '13px' }}>Corporate Identity (CIN) &amp; AoA/MoA</div>
                    <div className="panel-body">
                      <div className="form-group">
                        <label>CIN Number</label>
                        <input
                          type="text"
                          name="cin"
                          className="form-control input-sm text-uppercase"
                          value={formData.cin || ''}
                          onChange={handleChange}
                          disabled={!isEditing}
                          placeholder="U12345MP2020PTC012345"
                        />
                      </div>
                      <div className="form-group">
                        <label style={{ fontSize: '11px' }}>Date of Issue</label>
                        <input
                          type="date"
                          name="cinDoi"
                          className="form-control input-sm"
                          value={formData.cinDoi || ''}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div style={{ marginTop: '5px' }}>
                        <label style={{ fontSize: '10px', color: '#666' }}>Upload CIN (PDF &lt;2MB)</label>
                        <input
                          type="file"
                          name="cinUpload"
                          className="form-control"
                          accept=".pdf,.jpg,.jpeg"
                          onChange={handleFileChange}
                          disabled={!isEditing}
                        />
                        {files.cinUpload && (
                          <div style={{ fontSize: '11px', color: '#2e7d32', marginTop: '2px' }}>
                            <i className="fa fa-check-circle" /> {files.cinUpload.name}
                          </div>
                        )}
                      </div>
                      <div style={{ marginTop: '5px' }}>
                        <label style={{ fontSize: '10px', color: '#666' }}>Upload AoA</label>
                        <input
                          type="file"
                          name="aoaUpload"
                          className="form-control"
                          accept=".pdf,.jpg,.jpeg"
                          onChange={handleFileChange}
                          disabled={!isEditing}
                        />
                        {files.aoaUpload && (
                          <div style={{ fontSize: '11px', color: '#2e7d32', marginTop: '2px' }}>
                            <i className="fa fa-check-circle" /> {files.aoaUpload.name}
                          </div>
                        )}
                      </div>
                      <div style={{ marginTop: '5px' }}>
                        <label style={{ fontSize: '10px', color: '#666' }}>Upload MoA</label>
                        <input
                          type="file"
                          name="moaUpload"
                          className="form-control"
                          accept=".pdf,.jpg,.jpeg"
                          onChange={handleFileChange}
                          disabled={!isEditing}
                        />
                        {files.moaUpload && (
                          <div style={{ fontSize: '11px', color: '#2e7d32', marginTop: '2px' }}>
                            <i className="fa fa-check-circle" /> {files.moaUpload.name}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: Unit Factory Address & Industrial Area Details */}
              <div className="gov-sub-heading">
                4. {hindi ? 'इकाई का पता एवं स्थल विवरण' : 'Unit Factory Address & Industrial Area Details'}
              </div>
              <div className="row">
                <div className="col-md-4 col-sm-6">
                  <div className="form-group">
                    <label>
                      Unit Address Line 1 <span className="required-star">*</span>
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
                    <label>Unit Address Line 2</label>
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
                    <label>City / Village</label>
                    <input
                      type="text"
                      name="address3"
                      className="form-control"
                      value={formData.address3 || ''}
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

              <div className="row">
                <div className="col-md-3 col-sm-6">
                  <div className="form-group">
                    <label>{hindi ? 'इकाई संपर्क मोबाइल नं.' : 'Unit Contact Mobile No.'}</label>
                    <input
                      type="tel"
                      name="presentAddMobileNo"
                      maxLength={10}
                      className="form-control"
                      value={formData.presentAddMobileNo || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="9876543210"
                    />
                  </div>
                </div>

                <div className="col-md-3 col-sm-6">
                  <div className="form-group">
                    <label>{hindi ? 'इकाई टेलीफ़ोन नं.' : 'Unit Telephone No.'}</label>
                    <input
                      type="text"
                      name="presentAddTelephoneNo"
                      maxLength={20}
                      className="form-control"
                      value={formData.presentAddTelephoneNo || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="0755-1234567"
                    />
                  </div>
                </div>

                <div className="col-md-6 col-sm-12">
                  <div className="form-group">
                    <label style={{ fontSize: '11px', color: '#666' }}>
                      {hindi ? 'इकाई पते का प्रमाण / पट्टा विलेख (PDF ≤500KB)' : 'Upload Proof of Address / Lease Deed / Rent Agreement (PDF ≤500KB)'}
                    </label>
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

              {/* Industrial Area location selection */}
              <div style={{ backgroundColor: '#f9f9f9', border: '1px solid #e0e0e0', padding: '12px 15px', margin: '10px 0 15px', borderRadius: '4px' }}>
                <div className="row">
                  <div className="col-md-4 col-sm-12">
                    <label>
                      {hindi ? 'क्या इकाई औद्योगिक क्षेत्र में स्थित है?' : 'Is Unit located in an Industrial Area?'}
                    </label>
                    <div style={{ marginTop: '5px' }}>
                      <label className="radio-inline" style={{ marginRight: '15px' }}>
                        <input
                          type="radio"
                          name="unitInIndustrialArea"
                          value="Yes"
                          checked={formData.unitInIndustrialArea === 'Yes'}
                          onChange={handleChange}
                          disabled={!isEditing}
                        /> Yes
                      </label>
                      <label className="radio-inline">
                        <input
                          type="radio"
                          name="unitInIndustrialArea"
                          value="No"
                          checked={formData.unitInIndustrialArea === 'No'}
                          onChange={handleChange}
                          disabled={!isEditing}
                        /> No
                      </label>
                    </div>
                  </div>

                  {formData.unitInIndustrialArea === 'Yes' && (
                    <>
                      <div className="col-md-3 col-sm-4">
                        <div className="form-group">
                          <label>Industrial Area Name</label>
                          <input
                            type="text"
                            name="industrialArea"
                            className="form-control"
                            value={formData.industrialArea || ''}
                            onChange={handleChange}
                            disabled={!isEditing}
                            placeholder="Industrial Area"
                          />
                        </div>
                      </div>

                      <div className="col-md-2 col-sm-4">
                        <div className="form-group">
                          <label>Plot Nos.</label>
                          <input
                            type="text"
                            name="plotNos"
                            className="form-control"
                            value={formData.plotNos || ''}
                            onChange={handleChange}
                            disabled={!isEditing}
                            placeholder="Plot Number"
                          />
                        </div>
                      </div>

                      <div className="col-md-3 col-sm-4">
                        <div className="form-group">
                          <label>Area in Sq. Meters</label>
                          <input
                            type="number"
                            name="areaInSqm"
                            className="form-control"
                            value={formData.areaInSqm || ''}
                            onChange={handleChange}
                            disabled={!isEditing}
                            placeholder="Area (Sqm)"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Section 5: Registered Office Address */}
              <div className="gov-sub-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>5. {hindi ? 'पंजीकृत कार्यालय का पता' : 'Registered Office Address'}</span>
                {isEditing && (
                  <label style={{ fontSize: '12px', fontWeight: 'normal', cursor: 'pointer', margin: 0 }}>
                    <input
                      type="checkbox"
                      name="sameAsAbovecheck"
                      checked={!!formData.sameAsAbovecheck}
                      onChange={handleChange}
                      style={{ marginRight: '5px' }}
                    />
                    {hindi ? 'इकाई के पते के समान है (Same as Unit Address)' : 'Same as Unit Factory Address'}
                  </label>
                )}
              </div>

              <div className="row">
                <div className="col-md-4 col-sm-6">
                  <div className="form-group">
                    <label>
                      Office Address Line 1 <span className="required-star">*</span>
                    </label>
                    <input
                      type="text"
                      name="permanentAddress1"
                      className="form-control"
                      value={formData.permanentAddress1 || ''}
                      onChange={handleChange}
                      disabled={!isEditing || formData.sameAsAbovecheck}
                      required
                    />
                  </div>
                </div>

                <div className="col-md-4 col-sm-6">
                  <div className="form-group">
                    <label>Office Address Line 2</label>
                    <input
                      type="text"
                      name="permanentAddress2"
                      className="form-control"
                      value={formData.permanentAddress2 || ''}
                      onChange={handleChange}
                      disabled={!isEditing || formData.sameAsAbovecheck}
                    />
                  </div>
                </div>

                <div className="col-md-4 col-sm-6">
                  <div className="form-group">
                    <label>City / Village</label>
                    <input
                      type="text"
                      name="permanentAddress3"
                      className="form-control"
                      value={formData.permanentAddress3 || ''}
                      onChange={handleChange}
                      disabled={!isEditing || formData.sameAsAbovecheck}
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-2 col-sm-4">
                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      name="permanentStateId"
                      className="form-control"
                      value={formData.permanentStateId || 'Madhya Pradesh'}
                      onChange={handleChange}
                      disabled={!isEditing || formData.sameAsAbovecheck}
                    />
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
                      disabled={!isEditing || formData.sameAsAbovecheck}
                    />
                  </div>
                </div>

                <div className="col-md-3 col-sm-4">
                  <div className="form-group">
                    <label>Tehsil</label>
                    <input
                      type="text"
                      name="permanentTehsilId"
                      className="form-control"
                      value={formData.permanentTehsilId || ''}
                      onChange={handleChange}
                      disabled={!isEditing || formData.sameAsAbovecheck}
                    />
                  </div>
                </div>

                <div className="col-md-2 col-sm-6">
                  <div className="form-group">
                    <label>Block</label>
                    <input
                      type="text"
                      name="permanentBlockId"
                      className="form-control"
                      value={formData.permanentBlockId || ''}
                      onChange={handleChange}
                      disabled={!isEditing || formData.sameAsAbovecheck}
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
                      name="permanentPinCode"
                      maxLength={6}
                      className="form-control"
                      value={formData.permanentPinCode || ''}
                      onChange={handleChange}
                      disabled={!isEditing || formData.sameAsAbovecheck}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-3 col-sm-6">
                  <div className="form-group">
                    <label>
                      Office Mobile No. <span className="required-star">*</span>
                    </label>
                    <input
                      type="tel"
                      name="permanentAddMobileNo"
                      maxLength={10}
                      className="form-control"
                      value={formData.permanentAddMobileNo || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="9876543210"
                    />
                  </div>
                </div>

                <div className="col-md-3 col-sm-6">
                  <div className="form-group">
                    <label>Office Telephone No.</label>
                    <input
                      type="text"
                      name="permanentAddTelephoneNo"
                      maxLength={20}
                      className="form-control"
                      value={formData.permanentAddTelephoneNo || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="0755-1234567"
                    />
                  </div>
                </div>
              </div>

              {/* Section 6: Regulatory Clearances & NOCs */}
              <div className="gov-sub-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>6. {hindi ? 'नियामक अनुमतियां एवं एनओसी (RegNoc Details)' : 'Regulatory Clearances & NOCs (RegNoc Details)'}</span>
                {isEditing && (
                  <button
                    type="button"
                    onClick={addRegNoc}
                    className="btn btn-primary btn-sm"
                  >
                    <i className="fa fa-plus" /> {hindi ? 'एनओसी जोड़ें' : 'Add NOC / Clearance'}
                  </button>
                )}
              </div>

              <div className="table-responsive">
                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th style={{ width: '50px', textAlign: 'center' }}>S.No</th>
                      <th>Clearance / Certificate Type</th>
                      <th>Certificate / Registration No.</th>
                      <th style={{ width: '180px' }}>Valid Upto</th>
                      {isEditing && <th style={{ width: '60px', textAlign: 'center' }}>Action</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {regNocList.length === 0 ? (
                      <tr>
                        <td colSpan={isEditing ? 5 : 4} className="text-center text-muted" style={{ padding: '15px' }}>
                          {hindi ? 'कोई विनियामक एनओसी या अनापत्ति प्रमाण पत्र दर्ज नहीं है।' : 'No additional clearances or NOCs recorded.'}
                        </td>
                      </tr>
                    ) : (
                      regNocList.map((noc, idx) => (
                        <tr key={idx}>
                          <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{idx + 1}</td>
                          <td>
                            <input
                              type="text"
                              className="form-control input-sm"
                              value={noc.certiType || ''}
                              onChange={(e) => handleRegNocChange(idx, 'certiType', e.target.value)}
                              disabled={!isEditing}
                              placeholder="e.g. Fire Safety NOC / Forest Clearance"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="form-control input-sm"
                              value={noc.certiNo || ''}
                              onChange={(e) => handleRegNocChange(idx, 'certiNo', e.target.value)}
                              disabled={!isEditing}
                              placeholder="Certificate / NOC Number"
                            />
                          </td>
                          <td>
                            <input
                              type="date"
                              className="form-control input-sm"
                              value={noc.certiValidUpto || ''}
                              onChange={(e) => handleRegNocChange(idx, 'certiValidUpto', e.target.value)}
                              disabled={!isEditing}
                            />
                          </td>
                          {isEditing && (
                            <td style={{ textAlign: 'center' }}>
                              <button
                                type="button"
                                onClick={() => removeRegNoc(idx)}
                                className="btn btn-danger btn-xs"
                                title="Remove NOC"
                              >
                                <i className="fa fa-trash" />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Section 7: Bank Details */}
              <div className="gov-sub-heading">
                7. {hindi ? 'बैंक खाता विवरण' : 'Bank Account Details'}
              </div>
              <div className="row">
                <div className="col-md-3 col-sm-6">
                  <div className="form-group">
                    <label>
                      Bank Name <span className="required-star">*</span>
                    </label>
                    <select
                      name="bankName"
                      className="form-control"
                      value={formData.bankName}
                      onChange={handleChange}
                      disabled={!isEditing}
                    >
                      <option value="State Bank of India">State Bank of India</option>
                      <option value="Punjab National Bank">Punjab National Bank</option>
                      <option value="Bank of Baroda">Bank of Baroda</option>
                      <option value="Canara Bank">Canara Bank</option>
                      <option value="Union Bank of India">Union Bank of India</option>
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="Axis Bank">Axis Bank</option>
                      <option value="Other">Other Bank</option>
                    </select>
                  </div>
                </div>

                {formData.bankName === 'Other' && (
                  <div className="col-md-3 col-sm-6">
                    <div className="form-group">
                      <label>
                        Specify Other Bank <span className="required-star">*</span>
                      </label>
                      <input
                        type="text"
                        name="otherBankName"
                        className="form-control"
                        value={formData.otherBankName || ''}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                )}

                <div className="col-md-3 col-sm-6">
                  <div className="form-group">
                    <label>
                      Account Holder Name <span className="required-star">*</span>
                    </label>
                    <input
                      type="text"
                      name="bankAccountName"
                      className="form-control"
                      value={formData.bankAccountName || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="col-md-3 col-sm-6">
                  <div className="form-group">
                    <label>
                      Account Number <span className="required-star">*</span>
                    </label>
                    <input
                      type="text"
                      name="accountNumber"
                      className="form-control"
                      value={formData.accountNumber || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="col-md-3 col-sm-6">
                  <div className="form-group">
                    <label>
                      IFSC Code <span className="required-star">*</span>
                    </label>
                    <input
                      type="text"
                      name="ifsc"
                      maxLength={11}
                      className="form-control text-uppercase"
                      value={formData.ifsc || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="SBIN0001234"
                    />
                  </div>
                </div>

                <div className="col-md-6 col-sm-12">
                  <div className="form-group">
                    <label style={{ fontSize: '11px', color: '#666' }}>
                      Cancelled Cheque / Bank Passbook (PDF/JPEG &lt;500KB) <span className="required-star">*</span>
                    </label>
                    <input
                      type="file"
                      name="cancelledChequeUpload"
                      className="form-control"
                      accept=".pdf,.jpg,.jpeg"
                      onChange={handleFileChange}
                      disabled={!isEditing}
                    />
                    {files.cancelledChequeUpload && (
                      <div style={{ fontSize: '11px', color: '#2e7d32', marginTop: '3px' }}>
                        <i className="fa fa-check-circle" /> {files.cancelledChequeUpload.name}
                      </div>
                    )}
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
                        <i className="fa fa-save" /> {hindi ? 'औद्योगिक प्रोफ़ाइल सहेजें' : 'Save Industrial Profile'}
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
