// src/components/shared/FileUploader.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function FileUploader({ onUploadComplete }: { onUploadComplete: (url: string) => void }) {
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            // سنقوم بتنفيذ الرفع هنا لاحقاً
            // سيتم إضافة كود الرفع في الخطوة التالية
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="p-4 border rounded-lg">
            <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-input"
                accept="image/*,video/*"
                disabled={isUploading}
            />
            <Button
                onClick={() => document.getElementById('file-input')?.click()}
                disabled={isUploading}
            >
                {isUploading ? 'جاري الرفع...' : 'اختر ملف'}
            </Button>
        </div>
    );
}