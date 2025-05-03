import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function UploadSermon() {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const audioFile = files[0];
      if (audioFile.type === 'audio/mpeg' || audioFile.type === 'audio/mp3') {
        if (audioFile.size <= 25 * 1024 * 1024) { // 25MB max
          setFile(audioFile);
          // Extract filename without extension as default name
          const name = audioFile.name.split('.').slice(0, -1).join('.');
          setFileName(name);
        } else {
          setError('File size exceeds 25MB limit');
        }
      } else {
        setError('Please upload an MP3 file');
      }
    }
  };

  const handleFileSelect = (e) => {
    const audioFile = e.target.files[0];
    if (audioFile) {
      if (audioFile.type === 'audio/mpeg' || audioFile.type === 'audio/mp3') {
        if (audioFile.size <= 25 * 1024 * 1024) { // 25MB max
          setFile(audioFile);
          // Extract filename without extension as default name
          const name = audioFile.name.split('.').slice(0, -1).join('.');
          setFileName(name);
        } else {
          setError('File size exceeds 25MB limit');
        }
      } else {
        setError('Please upload an MP3 file');
      }
    }
  };

  const handleThumbnailSelect = (e) => {
    const imgFile = e.target.files[0];
    if (imgFile) {
      if (imgFile.type.startsWith('image/')) {
        setThumbnail(imgFile);
        const reader = new FileReader();
        reader.onload = (e) => {
          setThumbnailPreview(e.target.result);
        };
        reader.readAsDataURL(imgFile);
      } else {
        setError('Please select an image file');
      }
    }
  };

  const handleSubmit = async () => {
    if (!file || !fileName) {
      setError('Please select a file and provide a name');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      
      // Upload audio file - notice the path doesn't include the bucket name in the path
      const audioFileName = `${user.id}/${Date.now()}-${file.name}`;
      const { data: audioData, error: audioError } = await supabase.storage
        .from('sermons')
        .upload(audioFileName, file);
      
      if (audioError) throw audioError;
      
      // Get public URL for the audio file
      const { data: { publicUrl: audioUrl } } = supabase.storage
        .from('sermons')
        .getPublicUrl(audioFileName);
      
      // Upload thumbnail if provided
      let thumbnailUrl = null;
      if (thumbnail) {
        const thumbFileName = `${user.id}/${Date.now()}-${thumbnail.name}`;
        const { data: thumbnailData, error: thumbnailError } = await supabase.storage
          .from('thumbnails')
          .upload(thumbFileName, thumbnail);
        
        if (thumbnailError) throw thumbnailError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('thumbnails')
          .getPublicUrl(thumbFileName);
        
        thumbnailUrl = publicUrl;
      }
      
      // Create sermon record in database
      const { data: sermon, error: sermonError } = await supabase
        .from('sermons')
        .insert({
          user_id: user.id,
          title: fileName,
          audio_url: audioUrl,
          thumbnail_url: thumbnailUrl,
          file_size: file.size,
          duration: null, // Would need audio processing to get this
        })
        .select()
        .single();
      
      if (sermonError) throw sermonError;
      
      // Navigate back to dashboard
      navigate('/dashboard');
      
    } catch (err) {
      console.error('Error uploading sermon:', err.message);
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto py-8 px-4">
      <div className="text-center mb-6">
        <h1 className="text-xl font-semibold">Upload a sermon</h1>
      </div>
      
      {/* Drop zone */}
      <div 
        className={`border-2 border-dashed rounded-md p-6 mb-4 text-center ${dragging ? 'border-red-600 bg-red-50' : 'border-gray-300'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input').click()}
      >
        <div className="mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <p className="text-sm text-gray-500">
          {file ? file.name : "Drag and drop or click to upload. Max file upload is 25MB in MP3 format"}
        </p>
        <input 
          id="file-input" 
          type="file" 
          accept="audio/mpeg,audio/mp3" 
          className="hidden" 
          onChange={handleFileSelect}
        />
      </div>
      
      {/* File name input */}
      <div className="mb-4">
        <label htmlFor="file-name" className="block text-sm font-medium text-gray-700 mb-1">
          File Name<span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          id="file-name"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
          required
        />
      </div>
      
      {/* Thumbnail upload */}
      <div className="mb-6">
        <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-1">
          Thumbnail<span className="text-red-600">*</span>
        </label>
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => document.getElementById('thumbnail-input').click()}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
          >
            {thumbnailPreview ? 'Change image' : 'Upload an image'}
          </button>
          <input
            id="thumbnail-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleThumbnailSelect}
          />
          {thumbnailPreview && (
            <div className="ml-4">
              <img 
                src={thumbnailPreview} 
                alt="Thumbnail preview" 
                className="h-10 w-10 object-cover rounded"
              />
            </div>
          )}
          <button 
            type="button"
            className="ml-auto px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-200"
            onClick={() => document.getElementById('thumbnail-input').click()}
          >
            Browse
          </button>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="px-6 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={uploading}
          className="px-6 py-2 bg-gray-900 rounded-md text-sm font-medium text-white hover:bg-gray-800"
        >
          {uploading ? 'Uploading...' : 'Share'}
        </button>
      </div>
      
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}
    </div>
  );
}