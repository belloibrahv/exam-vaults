'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  PlayCircle, 
  Trophy,
  Star,
  Filter,
  Search
} from 'lucide-react';
import Link from 'next/link';
import CloudProviderLogo from '@/components/CloudProviderLogo';

interface LearningCatalogProps {
  certifications: any[];
}

export default function LearningCatalog({ certifications }: LearningCatalogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  // Extract unique providers and levels for filtering
  const providers = Array.from(
    new Set(certifications.map(cert => cert.provider.slug))
  );
  const levels = Array.from(
    new Set(certifications.map(cert => cert.level.slug))
  );

  // Filter certifications based on search and filters
  const filteredCertifications = certifications.filter(cert => {
    const matchesSearch = cert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProvider = selectedProvider === 'all' || cert.provider.slug === selectedProvider;
    const matchesLevel = selectedLevel === 'all' || cert.level.slug === selectedLevel;
    
    return matchesSearch && matchesProvider && matchesLevel;
  });

  // Calculate progress for a certification
  const calculateProgress = (cert: any) => {
    const totalLessons = cert.learningModules.reduce((acc: number, module: any) => 
      acc + module.lessons.length, 0
    );
    
    if (totalLessons === 0) return 0;
    
    const completedLessons = cert.learningModules.reduce((acc: number, module: any) =>
      acc + module.lessons.filter((lesson: any) => 
        lesson.userProgress.length > 0 && lesson.userProgress[0].completed
      ).length, 0
    );
    
    return Math.round((completedLessons / totalLessons) * 100);
  };

  // Get status badge for certification
  const getStatusBadge = (cert: any, progress: number) => {
    if (progress === 0) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <PlayCircle className="w-3 h-3 mr-1" />
          Start Learning
        </span>
      );
    } else if (progress === 100) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Completed
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <BookOpen className="w-3 h-3 mr-1" />
          In Progress
        </span>
      );
    }
  };

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search certifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-techvaults-red focus:border-transparent"
          />
        </div>
        
        <select
          value={selectedProvider}
          onChange={(e) => setSelectedProvider(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-techvaults-red focus:border-transparent"
        >
          <option value="all">All Providers</option>
          {providers.map(provider => (
            <option key={provider} value={provider} className="capitalize">
              {provider}
            </option>
          ))}
        </select>
        
        <select
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-techvaults-red focus:border-transparent"
        >
          <option value="all">All Levels</option>
          {levels.map(level => (
            <option key={level} value={level} className="capitalize">
              {level}
            </option>
          ))}
        </select>
      </div>

      {/* Certification Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCertifications.map((cert, index) => {
          const progress = calculateProgress(cert);
          const totalLessons = cert.learningModules.reduce((acc: number, module: any) => 
            acc + module.lessons.length, 0
          );
          const estimatedHours = cert.learningModules.reduce((acc: number, module: any) => 
            acc + module.lessons.reduce((lessonAcc: number, lesson: any) => 
              lessonAcc + lesson.estimatedTime, 0
            ), 0
          );

          return (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-200"
            >
              {/* Card Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <CloudProviderLogo 
                      provider={cert.provider.slug}
                      size={40}
                      className="flex-shrink-0"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {cert.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {cert.provider.displayName}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(cert, progress)}
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {cert.description}
                </p>

                {/* Progress Bar */}
                {progress > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium text-gray-900">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="bg-techvaults-red rounded-full h-2"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Card Stats */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-1" />
                      {totalLessons} lessons
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {Math.round(estimatedHours / 60)}h {estimatedHours % 60}m
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: cert.difficulty }, (_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="px-6 py-4">
                <Link href={`/learning/${cert.slug}`}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-techvaults-red text-white py-2.5 rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    {progress === 0 ? 'Start Learning' : progress === 100 ? 'Review' : 'Continue Learning'}
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredCertifications.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No certifications found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search terms or filters to find the certification you're looking for.
          </p>
        </div>
      )}

      {/* Learning Stats Summary */}
      {filteredCertifications.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Learning Journey</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {filteredCertifications.filter(cert => calculateProgress(cert) > 0).length}
              </div>
              <div className="text-sm text-blue-700">In Progress</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {filteredCertifications.filter(cert => calculateProgress(cert) === 100).length}
              </div>
              <div className="text-sm text-green-700">Completed</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {filteredCertifications.filter(cert => calculateProgress(cert) === 0).length}
              </div>
              <div className="text-sm text-yellow-700">Ready to Start</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}