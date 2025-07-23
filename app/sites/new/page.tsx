// app/sites/new/page.tsx
import React from 'react';
import { redirect } from 'next/navigation';
import SiteForm from '@/components/forms/SiteForm';
import { createSite } from '@/lib/actions/site-actions';

export default function NewSitePage() {
  async function handleCreateSite(formData: FormData) {
    'use server';
    
    const result = await createSite(formData);
    
    if (result.success) {
      redirect('/sites');
    } else {
      throw new Error(result.error || 'Failed to create site');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-purple-900/20">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Add New Railway Site
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create a new solar installation site for railway infrastructure
          </p>
        </div>
        
        <SiteForm onSubmit={handleCreateSite} />
      </div>
    </div>
  );
}
