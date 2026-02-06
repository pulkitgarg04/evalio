"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FileText, Video, Link as LinkIcon, Download, ArrowLeft } from 'lucide-react';

export default function SubjectResourcesPage() {
    const { id } = useParams();
    const router = useRouter();
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/resources/${id}`, {
                    credentials: 'include'
                });
                if (res.ok) {
                    const data = await res.json();
                    setResources(data);
                }
            } catch (error) {
                console.error("Failed to fetch resources", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchResources();
        }
    }, [id]);

    const getIcon = (type) => {
        switch (type) {
            case 'pdf': return <FileText size={24} className="text-red-500" />;
            case 'video': return <Video size={24} className="text-blue-500" />;
            case 'link': return <LinkIcon size={24} className="text-green-500" />;
            default: return <FileText size={24} className="text-gray-500" />;
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen text-gray-400">Loading resources...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto min-h-screen pb-10">
            <button
                onClick={() => router.back()}
                className="mb-6 flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
            >
                <ArrowLeft size={20} /> Back to Subjects
            </button>

            <h1 className="text-3xl font-bold text-gray-900 mb-8">Study Resources</h1>

            {resources.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                    <div className="flex flex-col items-center gap-4">
                        <div className="p-4 bg-gray-50 rounded-full text-gray-400">
                            <FileText size={32} />
                        </div>
                        <p className="text-gray-500 font-medium">No resources available for this subject yet.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resources.map((resource) => (
                        <div key={resource._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-gray-50 rounded-xl">
                                    {getIcon(resource.type)}
                                </div>
                                <span className="text-xs font-bold px-2 py-1 rounded bg-gray-100 text-gray-500 uppercase tracking-wide">
                                    {resource.type}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                                {resource.title}
                            </h3>

                            <div className="mt-auto pt-4">
                                <a
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors text-sm"
                                >
                                    <Download size={16} />
                                    View Resource
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
