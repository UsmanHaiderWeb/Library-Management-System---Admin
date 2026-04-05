/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo, useState } from 'react';
import { Upload, FileSpreadsheet, Download, AlertCircle, BookOpen, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { api } from '@/lib/AxiosCalls';

const BulkImport = () => {
    const [bookFile, setBookFile] = useState<File | null>(null);
    const [userFile, setUserFile] = useState<File | null>(null);
    const [isUploadingBooks, setIsUploadingBooks] = useState(false);
    const [isUploadingUsers, setIsUploadingUsers] = useState(false);

    const handleFileUpload = async (type: 'books' | 'users') => {
        const file = type === 'books' ? bookFile : userFile;
        if (!file) {
            toast.error("Please select a file first");
            return;
        }

        const setUploading = type === 'books' ? setIsUploadingBooks : setIsUploadingUsers;
        setUploading(true);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('adminToken');
            await api.post(`/api/admin/import/${type}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            toast.success(`${type === 'books' ? 'Books' : 'Users'} imported successfully!`);
            if (type === 'books') setBookFile(null);
            else setUserFile(null);
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || `Failed to import ${type}`);
        } finally {
            setUploading(false);
        }
    };

    const downloadTemplate = (type: 'books' | 'users') => {
        const url = `http://localhost:3000/templates/${type}_template.csv`;
        const link = document.createElement('a');
        link.href = url;
        link.download = `${type}_template.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(`${type} template downloaded!`);
    };

    return (
        <div className="px-7 w-full pb-10">
            <title>Bulk Import - GICCL | Library</title>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Bulk Import</h1>
                <p className="text-gray-500 mt-2">Upload CSV or Excel files to import multiple records at once.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Book Import Card */}
                <Card className="border-dashed border-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-blue-600" />
                            Import Books
                        </CardTitle>
                        <CardDescription>
                            Import multiple books into the system using a CSV file.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div
                            className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center transition-colors ${bookFile ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault();
                                const file = e.dataTransfer.files[0];
                                if (file) setBookFile(file);
                            }}
                        >
                            <Upload className={`w-10 h-10 mb-4 ${bookFile ? 'text-blue-500' : 'text-gray-400'}`} />
                            {bookFile ? (
                                <div className="text-center">
                                    <p className="text-sm font-medium text-blue-700">{bookFile.name}</p>
                                    <p className="text-xs text-blue-500">{(bookFile.size / 1024).toFixed(2)} KB</p>
                                    <Button variant="ghost" size="sm" className="mt-2 text-red-500 hover:text-red-700 h-8" onClick={() => setBookFile(null)}>Remove</Button>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <p className="text-sm text-gray-600">Drag & drop your file here or</p>
                                    <input
                                        type="file"
                                        id="bookImport"
                                        className="hidden"
                                        accept=".csv,.xlsx,.xls"
                                        onChange={(e) => setBookFile(e.target.files?.[0] || null)}
                                    />
                                    <label htmlFor="bookImport" className="text-sm font-semibold text-blue-600 cursor-pointer hover:underline">browse files</label>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between items-center bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                            <div className="flex items-center gap-2 text-xs text-blue-700">
                                <FileSpreadsheet className="w-4 h-4" />
                                <span>CSV structure: Title, Author, Genre, ISBN...</span>
                            </div>
                            <Button variant="ghost" size="sm" className="text-xs h-7 gap-1" onClick={() => downloadTemplate('books')}>
                                <Download className="w-3 h-3" /> Template
                            </Button>
                        </div>

                        <Button
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            disabled={!bookFile || isUploadingBooks}
                            onClick={() => handleFileUpload('books')}
                        >
                            {isUploadingBooks ? "Uploading..." : "Import Books"}
                        </Button>
                    </CardContent>
                </Card>

                {/* User Import Card */}
                <Card className="border-dashed border-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-green-600" />
                            Import Users
                        </CardTitle>
                        <CardDescription>
                            Import students, faculty, or staff members using a CSV file.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div
                            className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center transition-colors ${userFile ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault();
                                const file = e.dataTransfer.files[0];
                                if (file) setUserFile(file);
                            }}
                        >
                            <Upload className={`w-10 h-10 mb-4 ${userFile ? 'text-green-500' : 'text-gray-400'}`} />
                            {userFile ? (
                                <div className="text-center">
                                    <p className="text-sm font-medium text-green-700">{userFile.name}</p>
                                    <p className="text-xs text-green-500">{(userFile.size / 1024).toFixed(2)} KB</p>
                                    <Button variant="ghost" size="sm" className="mt-2 text-red-500 hover:text-red-700 h-8" onClick={() => setUserFile(null)}>Remove</Button>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <p className="text-sm text-gray-600">Drag & drop your file here or</p>
                                    <input
                                        type="file"
                                        id="userImport"
                                        className="hidden"
                                        accept=".csv,.xlsx,.xls"
                                        onChange={(e) => setUserFile(e.target.files?.[0] || null)}
                                    />
                                    <label htmlFor="userImport" className="text-sm font-semibold text-green-600 cursor-pointer hover:underline">browse files</label>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between items-center bg-green-50/50 p-3 rounded-lg border border-green-100">
                            <div className="flex items-center gap-2 text-xs text-green-700">
                                <FileSpreadsheet className="w-4 h-4" />
                                <span>CSV structure: Name, Email, StudentID, Role...</span>
                            </div>
                            <Button variant="ghost" size="sm" className="text-xs h-7 gap-1" onClick={() => downloadTemplate('users')}>
                                <Download className="w-3 h-3" /> Template
                            </Button>
                        </div>

                        <Button
                            className="w-full bg-green-600 hover:bg-green-700"
                            disabled={!userFile || isUploadingUsers}
                            onClick={() => handleFileUpload('users')}
                        >
                            {isUploadingUsers ? "Uploading..." : "Import Users"}
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Help/Notice Section */}
            <Card className="mt-8 bg-amber-50 border-amber-200">
                <CardContent className="pt-6">
                    <div className="flex gap-4">
                        <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
                        <div>
                            <h4 className="font-semibold text-amber-900 mb-1">Important Note</h4>
                            <p className="text-sm text-amber-800 leading-relaxed">
                                Please ensure your CSV files follow the required structure. The first row should be headers. For new users, a temporary password will be generated based on their Student ID or sent to their email.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default memo(BulkImport);
