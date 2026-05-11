'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Shield,
  User,
  ArrowLeft,
  UserPlus,
  Download,
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  _count: {
    examAttempts: number;
    userProgress: number;
  };
  examAttempts: Array<{
    startedAt: Date;
  }>;
}

interface UsersManagementProps {
  users: User[];
}

export default function UsersManagement({ users }: UsersManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'STUDENT' | 'ADMIN'>('ALL');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        window.location.reload();
      } else {
        alert('Failed to delete user');
      }
    } catch (error) {
      alert('Error deleting user');
    }
  };

  const handleToggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'ADMIN' ? 'STUDENT' : 'ADMIN';
    
    if (!confirm(`Change user role to ${newRole}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        window.location.reload();
      } else {
        alert('Failed to update user role');
      }
    } catch (error) {
      alert('Error updating user role');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-techvaults-gray-50 via-white to-techvaults-gray-100">
      {/* Header */}
      <header className="border-b border-techvaults-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-3 md:px-4 py-3 md:py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link
                href="/admin"
                className="p-2 hover:bg-techvaults-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-techvaults-gray-700" />
              </Link>
              <div>
                <h1 className="text-lg md:text-xl font-bold text-techvaults-black flex items-center gap-2">
                  <Users className="w-6 h-6 text-techvaults-red" />
                  User Management
                </h1>
                <p className="text-xs text-techvaults-gray-600">
                  {filteredUsers.length} of {users.length} users
                </p>
              </div>
            </div>
            <button className="px-4 py-2 bg-techvaults-red text-white rounded-lg font-semibold hover:bg-red-700 transition-all flex items-center gap-2 text-sm">
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Add User</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-3 md:px-4 py-6 md:py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-techvaults-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-techvaults-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-techvaults-gray-300 rounded-lg focus:ring-2 focus:ring-techvaults-red/20 focus:border-techvaults-red outline-none transition-all"
              />
            </div>

            {/* Role Filter */}
            <div className="flex gap-2">
              {(['ALL', 'STUDENT', 'ADMIN'] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                    roleFilter === role
                      ? 'bg-techvaults-red text-white'
                      : 'bg-techvaults-gray-100 text-techvaults-gray-700 hover:bg-techvaults-gray-200'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>

            {/* Export */}
            <button className="px-4 py-2.5 border-2 border-techvaults-gray-300 rounded-lg font-semibold text-sm hover:border-techvaults-red transition-all flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-xl border border-techvaults-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-techvaults-gray-50 border-b border-techvaults-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-techvaults-gray-700 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-techvaults-gray-700 uppercase tracking-wider hidden md:table-cell">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-techvaults-gray-700 uppercase tracking-wider hidden lg:table-cell">
                    Joined
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-techvaults-gray-700 uppercase tracking-wider hidden lg:table-cell">
                    Activity
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-techvaults-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-techvaults-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-techvaults-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <div>
                        <p className="text-sm font-semibold text-techvaults-black">{user.name}</p>
                        <p className="text-xs text-techvaults-gray-600">{user.email}</p>
                        <div className="md:hidden mt-1">
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-semibold ${
                              user.role === 'ADMIN'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {user.role}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'ADMIN'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {user.role === 'ADMIN' ? (
                          <Shield className="w-3 h-3" />
                        ) : (
                          <User className="w-3 h-3" />
                        )}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-techvaults-gray-600 hidden lg:table-cell">
                      {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <div className="text-sm">
                        <p className="text-techvaults-gray-900 font-semibold">
                          {user._count.examAttempts} exams
                        </p>
                        {user.examAttempts[0] && (
                          <p className="text-xs text-techvaults-gray-600">
                            Last: {format(new Date(user.examAttempts[0].startedAt), 'MMM dd')}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleRole(user.id, user.role)}
                          className="p-2 hover:bg-techvaults-gray-100 rounded-lg transition-colors"
                          title={`Change to ${user.role === 'ADMIN' ? 'Student' : 'Admin'}`}
                        >
                          {user.role === 'ADMIN' ? (
                            <User className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Shield className="w-4 h-4 text-red-600" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-techvaults-gray-400 mx-auto mb-3" />
              <p className="text-techvaults-gray-600">No users found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
