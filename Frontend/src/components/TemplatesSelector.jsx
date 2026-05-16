import { Check, Layout } from 'lucide-react';
import React from 'react'

const TemplatesSelector = ({ selectedTemplate, onChange }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const templates = [
        {
            id: 'classic',
            name: 'Classic',
            preview: 'A clean, traditional resume format with clear sections and professional typography'
        },
        {
            id: 'modern',
            name: 'Modern',
            preview: 'Sleek Design with strategic use of color and modern font choices'
        },
        {
            id: 'minimal',
            name: 'Minimal',
            preview: 'A minimalist resume layout that gets straight to the point'
        },
        {
            id: 'minimalImage',
            name: 'Minimal Image',
            preview: 'A minimalist resume layout that gets straight to the point'
        },
    ]

    return (
        <div className='relative'>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className='flex items-center gap-1 text-sm text-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 ring-blue-300 hover:ring transition-all px-3 py-2 rounded-lg'
            >
                <Layout size={14} />
                <span className='max-sm:hidden'>Template</span>
            </button>

            {isOpen && (
                <div className='absolute top-full right-0 sm:left-0 w-64 p-3 mt-2 space-y-3 z-10 bg-white rounded-md border border-gray-200 shadow-sm'>
                    {templates.map((template) => (
                        <div
                            key={template.id}
                            onClick={() => {
                                onChange(template.id);
                                setIsOpen(false);
                            }}
                            className={`relative p-3 border rounded-md cursor-pointer transition-all ${selectedTemplate === template.id
                                ? "border-blue-400 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                }`}
                        >
                            <div className="space-y-1 pr-6">
                                <h4 className='font-medium text-gray-800'>{template.name}</h4>
                                <div className='mt-1 p-2 bg-blue-50 rounded text-xs text-gray-500 italic'>{template.preview}</div>
                            </div>

                            {selectedTemplate === template.id && (
                                <div className="absolute top-3 right-3 size-5 bg-blue-500 rounded-full flex items-center justify-center">
                                    <Check className='w-3 h-3 text-white' />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default TemplatesSelector
