'use client';

import { useState } from 'react';
import { PolkadotProject } from '@/types';

interface AddProjectFormProps {
  onAdd: (project: PolkadotProject) => void;
  onClose: () => void;
}

const CATEGORIES: PolkadotProject['category'][] = [
  'Parachain',
  'DeFi',
  'NFT',
  'Developer Tools',
  'Infrastructure',
  'Governance',
];

export default function AddProjectForm({ onAdd, onClose }: AddProjectFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Parachain' as PolkadotProject['category'],
    url: '',
    logo: '',
    tags: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    if (!formData.url.trim()) {
      newErrors.url = 'URL is required';
    } else {
      try {
        new URL(formData.url);
      } catch {
        newErrors.url = 'Invalid URL';
      }
    }

    if (!formData.logo.trim()) {
      newErrors.logo = 'Logo URL is required';
    } else {
      try {
        new URL(formData.logo);
      } catch {
        newErrors.logo = 'Invalid logo URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const tags = formData.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const project: PolkadotProject = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: formData.name.trim(),
      description: formData.description.trim(),
      category: formData.category,
      url: formData.url.trim(),
      logo: formData.logo.trim(),
      tags: tags.length > 0 ? tags : ['Custom'],
    };

    onAdd(project);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-panel rounded-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-polkadot-pink to-polkadot-purple bg-clip-text text-transparent">
            Add New Project
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Project Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="glass-panel w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-polkadot-pink"
              placeholder="e.g., My Awesome Project"
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="glass-panel w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-polkadot-pink resize-none"
              placeholder="Describe the project in detail..."
            />
            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Category <span className="text-red-400">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as PolkadotProject['category'] })}
              className="glass-panel w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-polkadot-pink"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* URL */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Project URL <span className="text-red-400">*</span>
            </label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="glass-panel w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-polkadot-pink"
              placeholder="https://example.com"
            />
            {errors.url && <p className="text-red-400 text-xs mt-1">{errors.url}</p>}
          </div>

          {/* Logo URL */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Logo URL <span className="text-red-400">*</span>
            </label>
            <input
              type="url"
              value={formData.logo}
              onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
              className="glass-panel w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-polkadot-pink"
              placeholder="https://example.com/logo.svg"
            />
            {errors.logo && <p className="text-red-400 text-xs mt-1">{errors.logo}</p>}
            {formData.logo && !errors.logo && (
              <div className="mt-2">
                <p className="text-xs text-gray-400 mb-1">Preview:</p>
                <div className="w-16 h-16 rounded-lg bg-white/5 p-2 border border-white/10">
                  <img
                    src={formData.logo}
                    alt="Logo preview"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="glass-panel w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-polkadot-pink"
              placeholder="DeFi, Trading, Polkadot"
            />
            <p className="text-xs text-gray-400 mt-1">Separate tags with commas</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-polkadot-pink hover:bg-polkadot-pink/80 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
            >
              Add Project
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-lg font-medium transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

