import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { scanAPI } from '../../api/scan.api';
import './ImageUpload.css';

const ImageUpload = ({ 
  label = 'Image', 
  value, // File object or image URL string
  onChange, 
  error,
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB default
  previewUrl,
  className = '',
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [localPreview, setLocalPreview] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState('');
  const fileInputRef = useRef(null);

  // Determine preview URL
  const displayPreview = previewUrl || localPreview || (typeof value === 'string' ? value : null);

  const validateFile = (file) => {
    // Validate file type
    if (!file.type.match('image.*')) {
      return { valid: false, error: 'Please select an image file (JPEG, PNG, GIF, or WebP)' };
    }

    // Validate file size
    if (file.size > maxSize) {
      return { valid: false, error: `Image size must be less than ${maxSize / (1024 * 1024)}MB` };
    }

    return { valid: true };
  };

  const handleFile = async (file) => {
    // First validate file type and size
    const validation = validateFile(file);
    if (!validation.valid) {
      setScanError(validation.error);
      return;
    }

    // Clear previous scan error
    setScanError('');

    // Create preview immediately for better UX
    const reader = new FileReader();
    reader.onloadend = () => {
      setLocalPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Scan image quality before accepting
    try {
      setScanning(true);
      const response = await scanAPI.scanFoodImage(file);
      
      if (response.success) {
        // Image quality is good, accept the file
        setScanError('');
        if (onChange) {
          onChange(file);
        }
      } else {
        // Image quality validation failed
        setScanError(response.message || 'Image quality validation failed');
        setLocalPreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (error) {
      // Handle scan API errors
      const errorMessage = error.response?.data?.message || 'Failed to scan image quality. Please try again.';
      setScanError(errorMessage);
      setLocalPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } finally {
      setScanning(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLocalPreview(null);
    setScanError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onChange) {
      onChange(null);
    }
  };

  return (
    <div className={`image-upload-wrapper ${className}`}>
      {label && <label className="form-label">{label}</label>}
      
      <div
        className={`image-upload ${dragActive ? 'drag-active' : ''} ${error ? 'error' : ''} ${displayPreview ? 'has-preview' : ''} ${scanning ? 'scanning' : ''}`}
        onDragEnter={!scanning ? handleDrag : undefined}
        onDragLeave={!scanning ? handleDrag : undefined}
        onDragOver={!scanning ? handleDrag : undefined}
        onDrop={!scanning ? handleDrop : undefined}
        onClick={!scanning ? () => fileInputRef.current?.click() : undefined}
        style={{ cursor: scanning ? 'wait' : 'pointer' }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          style={{ display: 'none' }}
        />

        {scanning ? (
          <div className="image-scanning">
            <Loader2 size={32} className="spinning" />
            <p className="upload-text-primary">Scanning image quality...</p>
            <p className="upload-text-secondary">Please wait</p>
          </div>
        ) : displayPreview ? (
          <div className="image-preview">
            <img src={displayPreview} alt="Preview" />
            <button
              type="button"
              className="image-remove"
              onClick={handleRemove}
              aria-label="Remove image"
            >
              <X size={18} />
            </button>
            <div className="image-overlay">
              <Upload size={24} />
              <p>Click to change image</p>
            </div>
          </div>
        ) : (
          <div className="image-upload-placeholder">
            <Upload size={32} />
            <p className="upload-text-primary">Click to upload or drag and drop</p>
            <p className="upload-text-secondary">PNG, JPG, GIF, WebP up to {maxSize / (1024 * 1024)}MB</p>
          </div>
        )}
      </div>

      {scanError && <p className="form-error">{scanError}</p>}
      {error && !scanError && <p className="form-error">{error}</p>}
    </div>
  );
};

export default ImageUpload;

