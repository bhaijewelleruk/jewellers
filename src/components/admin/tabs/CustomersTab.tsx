'use client';

import React, { useState } from 'react';
import ScrollReveal from '@/components/shared/ScrollReveal';
import {
  AdminThemeStyles,
  RegisteredUserItem,
  LoginAttemptItem,
  AuditLogItem,
} from '../types';
import {
  UsersIcon,
  ShieldCheckIcon,
  CheckIcon,
  XIcon,
  SearchIcon,
  CrownIcon,
  LockIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  ExportIcon,
} from '../AdminIcons';

interface CustomersTabProps {
  themeStyles: AdminThemeStyles;
  registeredUsers: RegisteredUserItem[];
  loginAttemptsLogs: LoginAttemptItem[];
  auditLogs: AuditLogItem[];
  onUpdateUserStatus: (userId: string, email: string, newStatus: string, actionName: string) => Promise<void>;
  userLoadingId: string | null;
  userActionMsg: string;
  setUserActionMsg: (msg: string) => void;
  onExportAuditCSV: () => void;
}

export default function CustomersTab({
  themeStyles,
  registeredUsers,
  loginAttemptsLogs,
  auditLogs,
  onUpdateUserStatus,
  userLoadingId,
  userActionMsg,
  setUserActionMsg,
  onExportAuditCSV,
}: CustomersTabProps) {
  const {
    cardBg,
    subtitleColor,
    isLight,
    accentGold,
    titleColor,
    tableHeaderBg,
    tableRowHover,
    inputBg,
  } = themeStyles;

  const [userTabMode, setUserTabMode] = useState<'users' | 'security'>('users');
  const [userStatusFilter, setUserStatusFilter] = useState<'all' | 'active' | 'inactive' | 'banned' | 'locked'>('all');
  const [userSearchText, setUserSearchText] = useState('');
  const [auditCategoryFilter, setAuditCategoryFilter] = useState<'ALL' | 'AUTH' | 'SECURITY' | 'ORDER' | 'INVENTORY' | 'SYSTEM'>('ALL');
  const [auditSeverityFilter, setAuditSeverityFilter] = useState<'ALL' | 'INFO' | 'WARNING' | 'CRITICAL'>('ALL');

  // Filter users
  const filteredUsers = registeredUsers.filter((u) => {
    const displayName = (u.fullName || (u as any).name || '').toLowerCase();
    const matchesSearch =
      !userSearchText ||
      u.email.toLowerCase().includes(userSearchText.toLowerCase()) ||
      displayName.includes(userSearchText.toLowerCase()) ||
      ((u as any).phone && (u as any).phone.includes(userSearchText));

    if (!matchesSearch) return false;

    const isBanned = u.status === 'banned' || (u as any).isBanned === true;
    const isLocked = ((u as any).failedAttempts || u.loginAttempts || 0) >= 5 || (u as any).isLocked === true;

    if (userStatusFilter === 'all') return true;
    if (userStatusFilter === 'banned') return isBanned;
    if (userStatusFilter === 'locked') return isLocked;
    if (userStatusFilter === 'active') return u.status === 'active';
    if (userStatusFilter === 'inactive') return u.status === 'inactive';
    return true;
  });

  // Filter audit logs
  const filteredAuditLogs = auditLogs.filter((log) => {
    if (auditCategoryFilter !== 'ALL' && log.category !== auditCategoryFilter) return false;
    if (auditSeverityFilter !== 'ALL' && log.severity !== auditSeverityFilter) return false;
    return true;
  });

  return (
    <ScrollReveal direction="up" delay={100} className="space-y-6">
      {/* Sub-tab Switcher Header */}
      <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${cardBg} p-4 rounded-[5px]`}>
        <div>
          <h2 className={`font-serif text-lg font-bold ${accentGold} flex items-center gap-2`}>
            {userTabMode === 'users' ? (
              <>
                <UsersIcon className="w-5 h-5 text-gray-900" />
                <span>Registered User Accounts</span>
              </>
            ) : (
              <>
                <ShieldCheckIcon className="w-5 h-5 text-gray-900" />
                <span>Live IP Security &amp; Login Audit Logs</span>
              </>
            )}
          </h2>
          <p className={`text-[13.5px] font-medium text-gray-800 dark:text-gray-200`}>
            {userTabMode === 'users'
              ? 'Real-time list of all signed up clients and admin accounts stored in Supabase.'
              : 'Security tracking of login attempts, IP addresses, and 5-attempt lockout blocks.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setUserTabMode('users')}
            className={`px-4 py-2 rounded-[5px] text-xs font-semibold transition-all border flex items-center gap-1.5 cursor-pointer ${
              userTabMode === 'users'
                ? 'bg-gray-900 text-white border-gray-900 shadow-sm font-bold'
                : isLight
                ? 'bg-gray-100 text-[#5c4d40] border-gray-200'
                : 'bg-[#1a120e] text-[#c2b4a3] border-[#3a2c23]'
            }`}
          >
            <UsersIcon className="w-3.5 h-3.5" />
            <span>User Accounts ({registeredUsers.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setUserTabMode('security')}
            className={`px-4 py-2 rounded-[5px] text-xs font-semibold transition-all border flex items-center gap-1.5 cursor-pointer ${
              userTabMode === 'security'
                ? 'bg-gray-900 text-white border-gray-900 shadow-sm font-bold'
                : isLight
                ? 'bg-gray-100 text-[#5c4d40] border-gray-200'
                : 'bg-[#1a120e] text-[#c2b4a3] border-[#3a2c23]'
            }`}
          >
            <ShieldCheckIcon className="w-3.5 h-3.5" />
            <span>Security Audit Logs ({loginAttemptsLogs.length})</span>
          </button>
        </div>
      </div>

      {/* TAB MODE 1: REGISTERED USER ACCOUNTS TABLE */}
      {userTabMode === 'users' && (
        <div className="space-y-4">
          {userActionMsg && (
            <div className="p-3.5 rounded-[5px] bg-emerald-700 text-white text-xs font-semibold flex items-center justify-between shadow-md animate-fadeIn">
              <div className="flex items-center gap-2">
                <CheckIcon className="w-4 h-4 text-white" />
                <span>{userActionMsg}</span>
              </div>
              <button
                type="button"
                onClick={() => setUserActionMsg('')}
                className="text-white hover:text-gray-200 cursor-pointer"
              >
                <XIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Search & Filter Bar */}
          <div className={`p-4 rounded-[5px] ${cardBg} flex flex-col md:flex-row items-center justify-between gap-3`}>
            <div className="relative w-full md:w-80">
              <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search user by email or name..."
                value={userSearchText}
                onChange={(e) => setUserSearchText(e.target.value)}
                className={`w-full pl-9 pr-4 py-2 rounded-[5px] text-xs focus:outline-none ${inputBg}`}
              />
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {(['all', 'active', 'inactive', 'banned', 'locked'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setUserStatusFilter(filter)}
                  className={`px-3 py-1.5 rounded-[4px] text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    userStatusFilter === filter
                      ? 'bg-gray-900 text-white shadow-2xs'
                      : isLight
                      ? 'bg-gray-100 text-[#5c4d40] hover:bg-gray-200'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* User Table */}
          <div className={`${cardBg} rounded-[5px] overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[14px] font-medium text-black dark:text-white">
                <thead className={`${tableHeaderBg} uppercase tracking-wider font-semibold`}>
                  <tr>
                    <th className="p-4">Client / Account</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Security Health</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${tableRowHover}`}>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-400 text-xs">
                        No registered users found matching the selected filter.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => {
                      const isBanned = u.status === 'banned' || (u as any).isBanned === true;
                      const isInactive = u.status === 'inactive';
                      const failedCount = (u as any).failedAttempts ?? u.loginAttempts ?? 0;
                      const isLocked = failedCount >= 5 || (u as any).isLocked === true;
                      const isLoading = userLoadingId === u.id;
                      const displayName = u.fullName || (u as any).name || 'Registered Client';
                      const displayDate = (u as any).registeredDate || (u.created_at ? new Date(u.created_at).toLocaleDateString('en-GB') : 'Recently');
                      const displayPhone = (u as any).phone || 'N/A';

                      return (
                        <tr key={u.id} className="transition-colors">
                          <td className="p-4">
                            <p className={`font-semibold text-xs ${titleColor}`}>
                              {displayName}
                            </p>
                            <p className={`text-[11px] font-mono ${subtitleColor}`}>{u.email}</p>
                            <p className="text-[10px] text-gray-500 font-medium mt-0.5">
                              Joined: {displayDate} &bull; Phone: {displayPhone}
                            </p>
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-0.5 rounded-[4px] text-[10px] font-semibold uppercase ${
                                u.role === 'admin'
                                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                  : 'bg-gray-100 text-gray-800 border border-gray-200'
                              }`}
                            >
                              {u.role === 'admin' ? (
                                <span className="inline-flex items-center gap-1">
                                  <CrownIcon className="w-3 h-3 text-gray-900" /> Admin
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1">
                                  <UsersIcon className="w-3 h-3" /> Client
                                </span>
                              )}
                            </span>
                          </td>
                          <td className="p-4">
                            {isBanned ? (
                              <span className="px-2.5 py-1 rounded-[5px] bg-red-100 text-red-900 border border-red-300 font-bold text-[10.5px] inline-flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                                <span>Banned</span>
                              </span>
                            ) : isInactive ? (
                              <span className="px-2.5 py-1 rounded-[5px] bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[10.5px] inline-flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                                <span>Inactive</span>
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-[5px] bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-[10.5px] inline-flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                                <span>Active</span>
                              </span>
                            )}
                          </td>
                          <td className="p-4">
                            {isLocked ? (
                              <span className="px-2 py-0.5 rounded-[4px] bg-red-100 text-red-900 border border-red-300 font-semibold text-[10px] inline-flex items-center gap-1">
                                <LockIcon className="w-3 h-3 text-red-600" />
                                <span>IP Locked ({failedCount}/5)</span>
                              </span>
                            ) : (
                              <span
                                className={`text-[10.5px] font-mono inline-flex items-center gap-1 ${
                                  failedCount > 0 ? 'text-amber-600 font-bold' : subtitleColor
                                }`}
                              >
                                {failedCount > 0 ? (
                                  <>
                                    <AlertTriangleIcon className="w-3 h-3 text-amber-600" />
                                    <span>{failedCount} Failed Attempt(s)</span>
                                  </>
                                ) : (
                                  <>
                                    <CheckCircleIcon className="w-3 h-3 text-emerald-600" />
                                    <span>0 Security Issues</span>
                                  </>
                                )}
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5 flex-wrap">
                              {isBanned ? (
                                <button
                                  type="button"
                                  disabled={isLoading}
                                  onClick={() => onUpdateUserStatus(u.id, u.email, 'active', 'activate')}
                                  className="px-2.5 py-1 rounded-[4px] bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[10.5px] transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
                                >
                                  <CheckCircleIcon className="w-3 h-3" />
                                  <span>{isLoading ? '...' : 'Unban & Activate'}</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  disabled={isLoading}
                                  onClick={() => onUpdateUserStatus(u.id, u.email, 'banned', 'ban')}
                                  className="px-2.5 py-1 rounded-[4px] bg-red-600 hover:bg-red-700 text-white font-semibold text-[10.5px] transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
                                >
                                  <LockIcon className="w-3 h-3" />
                                  <span>{isLoading ? '...' : 'Ban Account'}</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB MODE 2: SECURITY AUDIT LOGS */}
      {userTabMode === 'security' && (
        <div className="space-y-4">
          <div className={`p-4 rounded-[5px] ${cardBg} flex flex-col md:flex-row items-center justify-between gap-3`}>
            <div className="flex items-center gap-2 flex-wrap">
              {/* Category Filter */}
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#1a120e] p-1 rounded-[5px] border border-gray-200 dark:border-[#3a2c23]">
                {(['ALL', 'AUTH', 'SECURITY', 'ORDER', 'INVENTORY', 'SYSTEM'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setAuditCategoryFilter(cat)}
                    className={`px-2 py-0.5 rounded-[4px] text-[10px] font-semibold transition-all cursor-pointer ${
                      auditCategoryFilter === cat ? 'bg-gray-900 text-white shadow-2xs' : `${subtitleColor} hover:${titleColor}`
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Severity Filter */}
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#1a120e] p-1 rounded-[5px] border border-gray-200 dark:border-[#3a2c23]">
                {(['ALL', 'INFO', 'WARNING', 'CRITICAL'] as const).map((sev) => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setAuditSeverityFilter(sev)}
                    className={`px-2 py-0.5 rounded-[4px] text-[10px] font-semibold transition-all cursor-pointer ${
                      auditSeverityFilter === sev
                        ? sev === 'CRITICAL'
                          ? 'bg-red-600 text-white shadow-2xs'
                          : sev === 'WARNING'
                          ? 'bg-amber-600 text-white shadow-2xs'
                          : 'bg-emerald-600 text-white shadow-2xs'
                        : `${subtitleColor} hover:${titleColor}`
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={onExportAuditCSV}
              className="px-3.5 py-2 rounded-[5px] border border-gray-200 bg-[#ffffff] hover:bg-[#fbfaf8] text-gray-900 dark:border-[#3a2c23] dark:bg-[#1a120e] dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <ExportIcon className="w-3.5 h-3.5" />
              <span>Export Audit CSV</span>
            </button>
          </div>

          {/* Audit Log Table */}
          <div className={`${cardBg} rounded-[5px] overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[14px] font-medium text-black dark:text-white">
                <thead className={`${tableHeaderBg} uppercase tracking-wider font-semibold`}>
                  <tr>
                    <th className="p-4">Log ID</th>
                    <th className="p-4">Timestamp (UTC)</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Action</th>
                    <th className="p-4">Details &amp; Event Payload</th>
                    <th className="p-4">Severity</th>
                    <th className="p-4">Origin IP</th>
                    <th className="p-4 text-right">Actor</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${tableRowHover}`}>
                  {filteredAuditLogs.map((log) => (
                    <tr key={log.id} className="transition-colors">
                      <td className="p-4 font-mono font-bold text-gray-900">{log.id}</td>
                      <td className="p-4 font-mono text-[11px] text-gray-800 dark:text-gray-200">{log.timestamp}</td>
                      <td className="p-4 font-semibold text-[10px]">{log.category}</td>
                      <td className="p-4 font-bold text-gray-800">{log.action}</td>
                      <td className="p-4 text-gray-600 max-w-xs truncate" title={log.details}>
                        {log.details}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded-[4px] text-[9.5px] font-bold uppercase ${
                            log.severity === 'ALERT' || log.severity === 'CRITICAL'
                              ? 'bg-red-100 text-red-800 border border-red-300'
                              : log.severity === 'WARNING'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}
                        >
                          {log.severity}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-[10px] text-gray-800 dark:text-gray-200">{log.ip}</td>
                      <td className="p-4 text-right font-medium text-gray-800">{log.actor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </ScrollReveal>
  );
}
