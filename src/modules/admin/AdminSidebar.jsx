import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from '../../hooks/useTranslation'
import './admin-sidebar.css'

export default function AdminSidebar({ onNavigate = () => {} }) {
  const { pathname } = useLocation()
  const { locale } = useTranslation()

  const [openSections, setOpenSections] = useState({
    userMgmt: pathname.includes('List') || pathname.includes('Officer') || pathname.includes('view') || pathname.includes('addOfficer'),
    officerMgmt: pathname.includes('officerList') || pathname.includes('externalOfficerList'),
    officeMgmt: pathname.includes('officeList') || pathname.includes('addOffice') || pathname.includes('viewOffice'),
    supplierFacility: pathname.includes('supplierName') || pathname.includes('supplyName'),
    viewOx: pathname.includes('ox') && !pathname.includes('editOx'),
    editOx: pathname.includes('editOx'),
    tankerMgmt: pathname.includes('tanker') || pathname.includes('supplySource'),
  })

  const toggle = (key, e) => {
    e.preventDefault()
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <nav className="admin-sidebar" aria-label="Admin Navigation">
      <ul className="nav" id="side-menu">
        {/* Dashboards */}
        <li>
          <NavLink
            to="/admin/dashboard"
            onClick={onNavigate}
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            <i className="fa fa-dashboard fa-fw" />
            <span>{locale === 'hi' ? 'डैशबोर्ड - ऑक्सीजन आपूर्ति' : 'Dashboard - Oxygen Supply'}</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/dashboardFacilityWise"
            onClick={onNavigate}
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            <i className="fa fa-dashboard fa-fw" />
            <span>Oxygen Supply Status - Supplier - Facility Wise</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/dashboardDistrictWise"
            onClick={onNavigate}
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            <i className="fa fa-dashboard fa-fw" />
            <span>Oxygen Supply Status - Facility Wise</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/dashboardDistrictFacilityType"
            onClick={onNavigate}
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            <i className="fa fa-dashboard fa-fw" />
            <span>Oxygen Supply Status - District - Facility Type Wise</span>
          </NavLink>
        </li>

        {/* User Management */}
        <li className={openSections.userMgmt ? 'active' : ''}>
          <a href="#userManagement" onClick={e => toggle('userMgmt', e)}>
            <i className="fa fa-bar-chart-o fa-fw" />
            <span>{locale === 'hi' ? 'उपयोगकर्ता प्रबंधन' : 'User Management'}</span>
            <span className={`fa arrow fa-chevron-${openSections.userMgmt ? 'down' : 'left'} pull-right`} />
          </a>
          {openSections.userMgmt && (
            <ul className="nav nav-second-level">
              {/* Officer Management */}
              <li className={openSections.officerMgmt ? 'active' : ''}>
                <a href="#officerManagement" onClick={e => toggle('officerMgmt', e)}>
                  <i className="fa fa-users fa-fw" />
                  <span>{locale === 'hi' ? 'अधिकारी प्रबंधन' : 'Officer Management'}</span>
                  <span className={`fa arrow fa-chevron-${openSections.officerMgmt ? 'down' : 'left'} pull-right`} />
                </a>
                {openSections.officerMgmt && (
                  <ul className="nav nav-third-level">
                    <li>
                      <NavLink to="/admin/officerList" onClick={onNavigate}>
                        <span>Section's Officer List</span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/admin/externalOfficerList" onClick={onNavigate}>
                        <span>Other Officer List</span>
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <NavLink to="/admin/hoList" onClick={onNavigate}>
                  <span>Section's HO List</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/zonalList" onClick={onNavigate}>
                  <span>Zonal List</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/dticList" onClick={onNavigate}>
                  <span>Dtic List</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/applicantList" onClick={onNavigate}>
                  <span>Applicant List</span>
                </NavLink>
              </li>
            </ul>
          )}
        </li>

        {/* Office Management */}
        <li className={openSections.officeMgmt ? 'active' : ''}>
          <a href="#officeManagement" onClick={e => toggle('officeMgmt', e)}>
            <i className="fa fa-building fa-fw" />
            <span>{locale === 'hi' ? 'कार्यालय प्रबंधन' : 'Office Management'}</span>
            <span className={`fa arrow fa-chevron-${openSections.officeMgmt ? 'down' : 'left'} pull-right`} />
          </a>
          {openSections.officeMgmt && (
            <ul className="nav nav-second-level">
              <li>
                <NavLink to="/admin/officeList" onClick={onNavigate}>
                  <span>Office List</span>
                </NavLink>
              </li>
            </ul>
          )}
        </li>

        {/* Supplier / Facility */}
        <li className={openSections.supplierFacility ? 'active' : ''}>
          <a href="#supplierFacility" onClick={e => toggle('supplierFacility', e)}>
            <i className="fa fa-truck fa-fw" />
            <span>Supplier / Facility</span>
            <span className={`fa arrow fa-chevron-${openSections.supplierFacility ? 'down' : 'left'} pull-right`} />
          </a>
          {openSections.supplierFacility && (
            <ul className="nav nav-second-level">
              <li>
                <NavLink to="/admin/supplierNameListAdmin" onClick={onNavigate}>
                  <span>Supplier Mgmt.</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/supplyNameList" onClick={onNavigate}>
                  <span>Facility Mgmt.</span>
                </NavLink>
              </li>
            </ul>
          )}
        </li>

        {/* View OX Forms */}
        <li className={openSections.viewOx ? 'active' : ''}>
          <a href="#viewOx" onClick={e => toggle('viewOx', e)}>
            <i className="fa fa-file-text-o fa-fw" />
            <span>View OX Forms</span>
            <span className={`fa arrow fa-chevron-${openSections.viewOx ? 'down' : 'left'} pull-right`} />
          </a>
          {openSections.viewOx && (
            <ul className="nav nav-second-level">
              <li>
                <NavLink to="/admin/ox1FormAdmin" onClick={onNavigate}>
                  <span>View Ox-1</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/ox2FormAdmin" onClick={onNavigate}>
                  <span>View Ox-2</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/ox3FormAdmin" onClick={onNavigate}>
                  <span>View Ox-3</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/ox4FormAdmin" onClick={onNavigate}>
                  <span>View Ox-4</span>
                </NavLink>
              </li>
            </ul>
          )}
        </li>

        {/* Edit OX Forms */}
        <li className={openSections.editOx ? 'active' : ''}>
          <a href="#editOx" onClick={e => toggle('editOx', e)}>
            <i className="fa fa-pencil-square-o fa-fw" />
            <span>Edit OX Forms</span>
            <span className={`fa arrow fa-chevron-${openSections.editOx ? 'down' : 'left'} pull-right`} />
          </a>
          {openSections.editOx && (
            <ul className="nav nav-second-level">
              <li>
                <NavLink to="/admin/editOx1FormAdmin" onClick={onNavigate}>
                  <span>Edit Ox-1</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/editOx2FormAdmin" onClick={onNavigate}>
                  <span>Edit Ox-2</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/editOx3FormAdmin" onClick={onNavigate}>
                  <span>Edit Ox-3</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/editOx4FormAdmin" onClick={onNavigate}>
                  <span>Edit Ox-4</span>
                </NavLink>
              </li>
            </ul>
          )}
        </li>

        {/* Ox Tanker Mgmt */}
        <li className={openSections.tankerMgmt ? 'active' : ''}>
          <a href="#tankerMgmt" onClick={e => toggle('tankerMgmt', e)}>
            <i className="fa fa-tachometer fa-fw" />
            <span>Ox Tanker Mgmt.</span>
            <span className={`fa arrow fa-chevron-${openSections.tankerMgmt ? 'down' : 'left'} pull-right`} />
          </a>
          {openSections.tankerMgmt && (
            <ul className="nav nav-second-level">
              <li>
                <NavLink to="/admin/tankerList" onClick={onNavigate}>
                  <span>Tanker Master Mgmt.</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/supplySourceList" onClick={onNavigate}>
                  <span>Supply Source Master Mgmt.</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/tankerSupplierList" onClick={onNavigate}>
                  <span>Tanker Supplier Master Mgmt.</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/tankerDetailsEntryFormAdmin" onClick={onNavigate}>
                  <span>Tanker Details Entry Form</span>
                </NavLink>
              </li>
            </ul>
          )}
        </li>
      </ul>
    </nav>
  )
}

