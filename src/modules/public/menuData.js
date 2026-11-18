/**
 * menuData.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Complete, authoritative header navigation and dropdown menu definition for
 * the MP MSME portal. Matches the official government navbar structure:
 *
 * 1. HOME
 * 2. ACTS & RULES
 * 3. FACILITATION COUNCIL ▾
 * 4. INFRA & LAND ▾
 * 5. POLICIES
 * 6. SCHEMES ▾
 * 7. ONLINE SERVICES ▾
 * 8. STARTUP ▾
 * 9. CIRCULARS ▾
 */

export const HEADER_NAVIGATION = [
  {
    id: 'home',
    labelEn: 'HOME',
    labelHi: 'होम',
    href: '/',
  },
  {
    id: 'acts-rules',
    labelEn: 'ACTS & RULES',
    labelHi: 'अधिनियम एवं नियम',
    href: '/website/acts-rules',
  },
  {
    id: 'facilitation-council',
    labelEn: 'FACILITATION COUNCIL',
    labelHi: 'सुविधा परिषद',
    children: [
      {
        id: 'fc-overview',
        labelEn: 'About Council & Constitution',
        labelHi: 'परिषद के बारे में एवं गठन',
        href: '/website/facilitation-council',
        icon: 'fa-university',
      },
      {
        id: 'fc-cases',
        labelEn: 'Case Status & Cause List',
        labelHi: 'प्रकरण स्थिति एवं वाद सूची',
        href: '/website/msefc-cases',
        icon: 'fa-gavel',
      },
      {
        id: 'fc-delayed-payment',
        labelEn: 'Delayed Payment Provisions',
        labelHi: 'विलंबित भुगतान प्रावधान एवं ब्याज गणक',
        href: '/website/msefc-delayed-payment',
        icon: 'fa-calculator',
      },
      {
        id: 'fc-rules',
        labelEn: 'MSEFC Rules & Filing Guidelines',
        labelHi: 'सुविधा परिषद नियम एवं आवेदन प्रक्रिया',
        href: '/website/msefc-rules',
        icon: 'fa-file-text-o',
      },
    ],
  },
  {
    id: 'infra-land',
    labelEn: 'INFRA & LAND',
    labelHi: 'इन्फ्रा एवं भूमि',
    children: [
      {
        id: 'land-developed',
        labelEn: 'Developed Land Allotment',
        labelHi: 'विकसित औद्योगिक भूमि आवंटन',
        href: '/website/vacant-land-developed',
        icon: 'fa-th-large',
      },
      {
        id: 'land-undeveloped',
        labelEn: 'Undeveloped Land Allotment',
        labelHi: 'अविकसित भूमि आवंटन',
        href: '/website/vacant-land-undeveloped',
        icon: 'fa-map-o',
      },
      {
        id: 'land-areas',
        labelEn: 'Industrial Areas Directory',
        labelHi: 'औद्योगिक क्षेत्र निर्देशिका एवं जीआईएस मानचित्र',
        href: '/website/industrial-areas',
        icon: 'fa-map-marker',
      },
      {
        id: 'land-reports',
        labelEn: 'Land Allotment Reports',
        labelHi: 'भूमि आवंटन रिपोर्ट एवं कलेक्टर दरें',
        href: '/website/land-reports',
        icon: 'fa-bar-chart',
      },
    ],
  },
  {
    id: 'policies',
    labelEn: 'POLICIES',
    labelHi: 'नीतियां',
    href: '/website/policies',
  },
  {
    id: 'schemes',
    labelEn: 'SCHEMES',
    labelHi: 'योजनाएं',
    children: [
      {
        id: 'scheme-mmuky',
        labelEn: 'Mukhyamantri Udyam Kranti Yojana',
        labelHi: 'मुख्यमंत्री उद्यम क्रांति योजना (MMUKY)',
        href: '/website/scheme-mmuky',
        icon: 'fa-rocket',
      },
      {
        id: 'scheme-financial',
        labelEn: 'Financial Assistance Scheme',
        labelHi: 'वित्तीय सहायता एवं प्रोत्साहन योजना',
        href: '/website/scheme-financial-assistance',
        icon: 'fa-money',
      },
      {
        id: 'scheme-cluster',
        labelEn: 'Cluster Development Scheme',
        labelHi: 'क्लस्टर विकास योजना (MSE-CDP)',
        href: '/website/scheme-cluster-development',
        icon: 'fa-cubes',
      },
      {
        id: 'scheme-quality',
        labelEn: 'Quality & Patent Assistance',
        labelHi: 'गुणवत्ता प्रमाणन एवं पेटेंट सहायता',
        href: '/website/scheme-quality-certification',
        icon: 'fa-certificate',
      },
    ],
  },
  {
    id: 'online-services',
    labelEn: 'ONLINE SERVICES',
    labelHi: 'ऑनलाइन सेवाएं',
    children: [
      {
        id: 'service-land',
        labelEn: 'Apply for Land Allotment',
        labelHi: 'औद्योगिक भूमि आवंटन हेतु आवेदन',
        href: '/website/service-land-allotment',
        icon: 'fa-pencil-square-o',
      },
      {
        id: 'service-financial',
        labelEn: 'Apply for Financial Assistance',
        labelHi: 'वित्तीय सहायता / सब्सिडी हेतु दावा',
        href: '/website/service-financial-assistance',
        icon: 'fa-inr',
      },
      {
        id: 'service-noc',
        labelEn: 'Online NOC on MPIDC',
        labelHi: 'एमपीडबल्यूआईडीसी सिंगल विंडो एनओसी',
        href: '/website/service-mpidc-noc',
        icon: 'fa-shield',
      },
      {
        id: 'service-status',
        labelEn: 'Application Status Tracker',
        labelHi: 'एकीकृत आवेदन स्थिति ट्रैकर',
        href: '/website/application-status',
        icon: 'fa-search',
      },
      {
        id: 'service-grievance',
        labelEn: 'Grievance Redressal & Helpdesk',
        labelHi: 'शिकायत निवारण एवं सहायता केंद्र',
        href: '/website/service-grievance',
        icon: 'fa-life-ring',
      },
    ],
  },
  {
    id: 'startup',
    labelEn: 'STARTUP',
    labelHi: 'स्टार्टअप',
    children: [
      {
        id: 'startup-policy',
        labelEn: 'MP Startup Policy & Guidelines',
        labelHi: 'म.प्र. स्टार्टअप नीति एवं दिशा-निर्देश',
        href: '/website/startup-policy',
        icon: 'fa-lightbulb-o',
      },
      {
        id: 'startup-incubation',
        labelEn: 'Incubation Centers & Co-Working',
        labelHi: 'इनक्यूबेशन सेंटर एवं सह-कार्य स्थल',
        href: '/website/startup-incubation',
        icon: 'fa-building-o',
      },
      {
        id: 'startup-funding',
        labelEn: 'Startup Incentives & Funding',
        labelHi: 'स्टार्टअप प्रोत्साहन एवं वित्त पोषण सहायता',
        href: '/website/startup-funding',
        icon: 'fa-trophy',
      },
      {
        id: 'startup-directory',
        labelEn: 'Recognized Startups Directory',
        labelHi: 'मान्यता प्राप्त स्टार्टअप निर्देशिका',
        href: '/website/startup-directory',
        icon: 'fa-users',
      },
    ],
  },
  {
    id: 'circulars',
    labelEn: 'CIRCULARS',
    labelHi: 'परिपत्र एवं आदेश',
    children: [
      {
        id: 'circulars-orders',
        labelEn: 'Orders & Circulars',
        labelHi: 'विभागीय आदेश एवं परिपत्र',
        href: '/website/orderCirculars',
        icon: 'fa-book',
      },
      {
        id: 'circulars-notifications',
        labelEn: 'Notifications & Gazette',
        labelHi: 'अधिसूचनाएं एवं राजपत्र',
        href: '/website/circulars-notifications',
        icon: 'fa-newspaper-o',
      },
      {
        id: 'circulars-tenders',
        labelEn: 'Tenders & Procurement',
        labelHi: 'निविदाएं एवं खरीद सूचनाएं',
        href: '/website/tenders',
        icon: 'fa-tags',
      },
      {
        id: 'circulars-search',
        labelEn: 'Advance Document Search',
        labelHi: 'अग्रिम दस्तावेज खोज (आर्काइव)',
        href: '/website/advanceSearch',
        icon: 'fa-search-plus',
      },
    ],
  },
]

/**
 * Transform navigation items into format expected by WebsiteMenuItem.
 */
export function getPublicHeaderMenu(hindi = false) {
  return HEADER_NAVIGATION.map(item => ({
    label: hindi ? item.labelHi : item.labelEn,
    href: item.href || '',
    children: item.children
      ? item.children.map(child => ({
          label: hindi ? child.labelHi : child.labelEn,
          href: child.href,
          description: child.description,
          icon: child.icon,
        }))
      : undefined,
  }))
}

/**
 * Flat list of all dropdown items for quick lookup or site maps.
 */
export function getAllDropdownItems() {
  const items = []
  for (const group of HEADER_NAVIGATION) {
    if (group.children?.length) {
      for (const child of group.children) {
        items.push({
          parentLabel: group.labelEn,
          parentLabelHi: group.labelHi,
          ...child,
        })
      }
    }
  }
  return items
}
