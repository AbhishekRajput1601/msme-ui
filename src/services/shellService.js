/**
 * shellService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Client-side service for portal shell APIs (menu, permissions, localization, dashboard counts).
 *
 * Designed with graceful fallbacks so the UI remains 100% operational during
 * phased backend rollout.
 */

import { get } from '../api/httpClient'
import { jsonData } from '../api/responseData'
import { SHELL } from '../api/endpoints'

/**
 * Fetches dynamic navigation menu items for the authenticated user.
 *
 * @returns {Promise<Array<{ label: string, href: string, icon?: string, badge?: string }>>}
 */
export async function fetchMenu() {
  try {
    const data = await get(SHELL.MENU)
    if (Array.isArray(data) && data.length > 0) {
      return data
    }
  } catch (err) {
    // Non-critical; fallback to layout static menu
  }
  return []
}

/**
 * Fetches user permissions and feature flags.
 *
 * @returns {Promise<{ permissions: string[] }>}
 */
export async function fetchPermissions() {
  try {
    const data = await get(SHELL.PERMISSIONS)
    if (data && Array.isArray(data.permissions)) {
      return data
    }
  } catch (err) {
    // Fallback
  }
  return { permissions: [] }
}

/**
 * Fetches live dashboard summary counts and work queue metrics.
 *
 * @returns {Promise<{
 *   pendingScrutiny: number,
 *   inspectionsScheduled: number,
 *   pendingApprovals: number,
 *   totalAllotmentsIssued: number,
 *   openGrievances: number
 * }>}
 */
export async function fetchDashboardCounts() {
  const data = jsonData(await get(SHELL.DASHBOARD_COUNTS))
  if (Array.isArray(data)) throw new Error('The server returned invalid dashboard statistics.')
  return data
}

export default {
  fetchMenu,
  fetchPermissions,
  fetchDashboardCounts,
}
