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
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
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

                    {isEditing && (
                      <div className="col-md-4 col-sm-12">
                        <div className="form-group">
                          <label>Upload Udyam Certificate (PDF/JPEG &lt;500KB)</label>
                          <input
                            type="file"
                            name="udyamUpload"
                            accept=".pdf,.jpg,.jpeg"
                            onChange={handleFileChange}
                          />
                        </div>
                      </div>
                    )}
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
                      {isEditing && (
                        <input
                          type="file"
                          name="panUpload"
                          accept=".pdf,.jpg,.jpeg"
                          onChange={handleFileChange}
                          style={{ marginTop: '5px' }}
                        />
                      )}
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
                      {isEditing && (
                        <input
                          type="file"
                          name="tanUpload"
                          accept=".pdf,.jpg,.jpeg"
                          onChange={handleFileChange}
                          style={{ marginTop: '5px' }}
                        />
                      )}
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
                      {isEditing && (
                        <input
                          type="file"
                          name="gstUpload"
                          accept=".pdf,.jpg,.jpeg"
                          onChange={handleFileChange}
                          style={{ marginTop: '5px' }}
                        />
                      )}
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
                      <th style={{ width: '90px' }}>Gender</th>
                      <th style={{ width: '90px' }}>Category</th>
                      <th>ID Proof No</th>
                      <th>Mobile</th>
                      <th style={{ width: '80px' }}>Share %</th>
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

              {/* Section 3: Statutory Licenses */}
              <div className="gov-sub-heading">
                3. {hindi ? 'लाइसेंस एवं विनियामक अनुमतियां' : 'Statutory Licenses & Regulatory Clearances'}
              </div>
              <div className="row">
                <div className="col-md-4 col-sm-6">
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
                    </div>
                  </div>
                </div>

                <div className="col-md-4 col-sm-6">
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
                    </div>
                  </div>
                </div>

                <div className="col-md-4 col-sm-6">
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

              {/* Section 5: Bank Details */}
              <div className="gov-sub-heading">
                5. {hindi ? 'बैंक खाता विवरण' : 'Bank Account Details'}
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

                {isEditing && (
                  <div className="col-md-6 col-sm-12">
                    <div className="form-group">
                      <label style={{ fontSize: '11px', color: '#666' }}>
                        Cancelled Cheque / Bank Passbook (PDF/JPEG &lt;500KB) <span className="required-star">*</span>
                      </label>
                      <input
                        type="file"
                        name="cancelledChequeUpload"
                        accept=".pdf,.jpg,.jpeg"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                )}
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
