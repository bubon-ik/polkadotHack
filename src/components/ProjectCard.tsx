'use client';

import { PolkadotProject } from '@/types';
import Image from 'next/image';

interface ProjectCardProps {
  project: PolkadotProject;
  isSpinning?: boolean;
}

export default function ProjectCard({ project, isSpinning = false }: ProjectCardProps) {
  const categoryColors = {
    Parachain: 'bg-purple-500/20 text-purple-300',
    DeFi: 'bg-green-500/20 text-green-300',
    NFT: 'bg-pink-500/20 text-pink-300',
    'Developer Tools': 'bg-blue-500/20 text-blue-300',
    Infrastructure: 'bg-yellow-500/20 text-yellow-300',
    Governance: 'bg-red-500/20 text-red-300',
  };

  return (
    <div
      className={`glass-panel rounded-2xl p-6 sm:p-8 max-w-2xl w-full transition-all duration-500 ${
        isSpinning ? 'animate-pulse scale-95 opacity-50' : 'scale-100 opacity-100'
      }`}
    >
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        {/* Project Logo */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gradient-to-br from-polkadot-pink to-polkadot-purple p-0.5">
            <div className="w-full h-full rounded-xl bg-polkadot-darkPurple flex items-center justify-center overflow-hidden">
              <Image
                src={project.logo}
                alt={`${project.name} logo`}
                width={80}
                height={80}
                className="w-full h-full object-contain p-2"
                onError={(e) => {
                  // Fallback if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          </div>
        </div>

        {/* Project Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start gap-2 mb-3">
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-polkadot-pink to-polkadot-purple bg-clip-text text-transparent">
              {project.name}
            </h2>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[project.category]}`}>
              {project.category}
            </span>
          </div>

          <p className="text-gray-300 text-sm sm:text-base mb-4 leading-relaxed">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-white/5 rounded-md text-xs text-gray-400 border border-white/10"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Visit Button */}
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-polkadot-pink hover:bg-polkadot-pink/80 rounded-lg transition-all duration-200 transform hover:scale-105 text-sm font-medium"
          >
            Visit Project
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}




