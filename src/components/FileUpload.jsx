import { useState, useRef } from 'react'
import { Upload, X, File, Image, FileText } from 'lucide-react'
import Button from './Button'
import './FileUpload.css'

/**
 * FileUpload 컴포넌트
 * 상세서.md Section 7.4.3 기반
 * 드래그앤드롭 + 클릭 업로드 지원
 */
function FileUpload({
    accept = '.png,.jpg,.jpeg,.pdf',
    maxSize = 10 * 1024 * 1024, // 10MB
    maxFiles = 5,
    files = [],
    onChange,
    error,
    className = '',
}) {
    const [isDragging, setIsDragging] = useState(false)
    const inputRef = useRef(null)

    const getFileIcon = (type) => {
        if (type.startsWith('image/')) return Image
        if (type === 'application/pdf') return FileText
        return File
    }

    const formatSize = (bytes) => {
        if (bytes < 1024) return `${bytes}B`
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
        return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
    }

    const handleDragEnter = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)

        const droppedFiles = Array.from(e.dataTransfer.files)
        addFiles(droppedFiles)
    }

    const handleFileSelect = (e) => {
        const selectedFiles = Array.from(e.target.files)
        addFiles(selectedFiles)
        e.target.value = '' // 같은 파일 다시 선택 가능하도록
    }

    const addFiles = (newFiles) => {
        const validFiles = newFiles.filter(file => {
            // 파일 크기 체크
            if (file.size > maxSize) {
                alert(`파일 크기가 ${formatSize(maxSize)}를 초과합니다: ${file.name}`)
                return false
            }
            return true
        })

        // 최대 파일 수 체크
        const totalFiles = [...files, ...validFiles].slice(0, maxFiles)
        onChange?.(totalFiles)
    }

    const removeFile = (index) => {
        const newFiles = files.filter((_, i) => i !== index)
        onChange?.(newFiles)
    }

    return (
        <div className={`file-upload ${className}`}>
            {/* Drop Zone */}
            <div
                className={`file-upload-zone ${isDragging ? 'dragging' : ''} ${error ? 'error' : ''}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    multiple={maxFiles > 1}
                    onChange={handleFileSelect}
                    hidden
                />
                <Upload size={32} className="file-upload-icon" />
                <p className="file-upload-text">
                    파일을 드래그하거나 <span className="file-upload-link">클릭하여 업로드</span>
                </p>
                <p className="file-upload-hint">
                    {accept.replace(/\./g, '').toUpperCase().replace(/,/g, ', ')} 지원 · 최대 {formatSize(maxSize)}
                </p>
            </div>

            {/* File List */}
            {files.length > 0 && (
                <ul className="file-upload-list">
                    {files.map((file, index) => {
                        const FileIcon = getFileIcon(file.type)

                        return (
                            <li key={index} className="file-upload-item">
                                <div className="file-upload-item-info">
                                    <FileIcon size={20} className="file-upload-item-icon" />
                                    <div className="file-upload-item-details">
                                        <span className="file-upload-item-name">{file.name}</span>
                                        <span className="file-upload-item-size">{formatSize(file.size)}</span>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="file-upload-item-remove"
                                    onClick={() => removeFile(index)}
                                    aria-label="파일 삭제"
                                >
                                    <X size={16} />
                                </button>
                            </li>
                        )
                    })}
                </ul>
            )}

            {/* Error Message */}
            {error && (
                <span className="file-upload-error">{error}</span>
            )}
        </div>
    )
}

export default FileUpload
