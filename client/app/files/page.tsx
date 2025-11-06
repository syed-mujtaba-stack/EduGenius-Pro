'use client';

import { useState, useEffect } from 'react';
import { FileText, Download, Trash2, Eye, Upload } from 'lucide-react';
import FileUpload from '@/app/components/file-upload';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/lib/auth-context';

interface UploadedFile {
  id: string;
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  url: string;
  uploadedAt: string;
}

export default function FilesPage() {
  const { user } = useAuth();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upload' | 'manage'>('manage');

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const response = await apiClient.getFiles();
      setFiles(response.files || []);
    } catch (error) {
      console.error('Failed to load files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUploaded = (file: UploadedFile) => {
    setFiles(prev => [file, ...prev]);
  };

  const handleDeleteFile = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      await apiClient.deleteFile(fileId);
      setFiles(prev => prev.filter(file => file.id !== fileId));
    } catch (error) {
      console.error('Failed to delete file:', error);
      alert('Failed to delete file. Please try again.');
    }
  };

  const handleProcessFile = async (fileId: string) => {
    try {
      const response = await apiClient.processFile(fileId);
      alert(`File processed! Extracted text: ${response.extractedText}`);
    } catch (error) {
      console.error('Failed to process file:', error);
      alert('Failed to process file. Please try again.');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimetype: string) => {
    if (mimetype.startsWith('image/')) return '🖼️';
    if (mimetype === 'application/pdf') return '📄';
    if (mimetype.includes('document') || mimetype.includes('word')) return '📝';
    if (mimetype === 'text/plain') return '📄';
    return '📄';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading files...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">File Management</h1>
          <p className="text-gray-400">Upload and manage your learning materials and documents.</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-gray-800 rounded-lg p-1 mb-6 shadow-lg">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('manage')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === 'manage'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              Manage Files
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === 'upload'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              Upload Files
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'upload' && (
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Upload className="h-5 w-5 mr-2" />
              Upload New Files
            </h2>
            <FileUpload onFileUploaded={handleFileUploaded} />
          </div>
        )}

        {activeTab === 'manage' && (
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Your Files ({files.length})
              </h2>
              <button
                onClick={() => setActiveTab('upload')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload New
              </button>
            </div>

            {files.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-400 mb-2">No files uploaded yet</h3>
                <p className="text-gray-500 mb-4">Upload your first document to get started with AI-powered learning.</p>
                <button
                  onClick={() => setActiveTab('upload')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                >
                  Upload Your First File
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl">{getFileIcon(file.mimetype)}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium text-sm truncate" title={file.originalname}>
                            {file.originalname}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-400 text-xs mb-4">
                      Uploaded {new Date(file.uploadedAt).toLocaleDateString()}
                    </p>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleProcessFile(file.id)}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-2 rounded transition-colors duration-200 flex items-center justify-center"
                        title="Process with AI"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Process
                      </button>
                      <button
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white text-xs px-3 py-2 rounded transition-colors duration-200 flex items-center justify-center"
                        title="Download"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </button>
                      <button
                        onClick={() => handleDeleteFile(file.id)}
                        className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-2 rounded transition-colors duration-200 flex items-center justify-center"
                        title="Delete"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
