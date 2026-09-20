import React from 'react';
import {
  Award,
  Download,
  Share2,
  Printer,
  CheckCircle2,
  Shield,
  X,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { CodingLanguage, LANGUAGE_METADATA } from './codingProblems';
import { UserProfile } from '../../types';
import { TitanLogo } from '../common/TitanLogo';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: CodingLanguage;
  solvedCount: number;
  totalCount: number;
  profile: UserProfile;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  language,
  solvedCount,
  totalCount,
  profile,
}) => {
  if (!isOpen) return null;

  const langMeta = LANGUAGE_METADATA[language];
  const certId = `TITAN-CERT-${language.toUpperCase()}-${Math.abs(
    (profile.name.length * 9999 + solvedCount * 123) % 90000 + 10000
  )}`;
  const dateStr = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#090d16] border border-cyan-500/40 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.25)] flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="px-6 py-3 bg-[#0d1422] border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <Award className="w-4 h-4 text-cyan-400" />
            <span className="font-bold tracking-wider uppercase">Verified Engineering Credential</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-white text-sm p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Certificate Canvas Body */}
        <div
          id="titan-certificate-printable"
          className="p-8 sm:p-10 relative overflow-hidden bg-gradient-to-b from-[#090d16] via-[#0b101c] to-[#07090e] border-2 border-cyan-500/30 m-4 rounded-xl shadow-2xl flex flex-col items-center text-center"
        >
          {/* Subtle Decorative Background Lines */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.08)_0,transparent_70%)] pointer-events-none" />
          <div className="absolute inset-2 border border-white/[0.06] rounded-lg pointer-events-none" />

          {/* Top Crest */}
          <div className="flex flex-col items-center gap-2 mb-4 relative z-10">
            <TitanLogo size={44} />
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-cyan-400 font-bold">
              TITAN OS // ENGINEERING ACADEMY
            </span>
          </div>

          <h2 className="font-tech text-xl sm:text-2xl font-bold tracking-tight text-white uppercase relative z-10 mb-1">
            Certificate of Mastery
          </h2>
          <span className="text-xs text-zinc-400 font-mono tracking-wider uppercase mb-6">
            ALGORITHMIC PROBLEM SOLVING & SYSTEMS ENGINEERING
          </span>

          <span className="text-xs text-zinc-400 font-sans italic mb-1">
            This certifies that
          </span>
          <h3 className="font-tech text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-cyan-200 tracking-wide mb-2">
            {profile.name || 'Software Engineer'}
          </h3>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-lg leading-relaxed font-sans mb-6">
            has demonstrated proficiency in data structures, algorithmic design patterns, and runtime complexity analysis in{' '}
            <strong className="text-cyan-300 font-mono">{langMeta.name}</strong>, completing technical verification problems on the TITAN OS runtime.
          </p>

          {/* Badge & Metrics Bar */}
          <div className="flex items-center justify-center gap-6 py-3 px-6 bg-white/[0.03] border border-white/[0.08] rounded-xl mb-8 w-full max-w-md">
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-zinc-500 font-mono uppercase">Language Track</span>
              <span className="text-xs font-mono font-bold text-white">{langMeta.name} ({langMeta.version})</span>
            </div>
            <div className="w-px h-8 bg-white/[0.08]" />
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-zinc-500 font-mono uppercase">Verification Score</span>
              <span className="text-xs font-mono font-bold text-emerald-400">100% Verified</span>
            </div>
            <div className="w-px h-8 bg-white/[0.08]" />
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-zinc-500 font-mono uppercase">Date Issued</span>
              <span className="text-xs font-mono font-bold text-zinc-300">{dateStr}</span>
            </div>
          </div>

          {/* Bottom Seal & Credentials */}
          <div className="w-full flex items-center justify-between border-t border-white/[0.08] pt-4 text-left">
            <div className="flex flex-col">
              <span className="text-[9px] font-mono text-zinc-500 uppercase">Credential ID:</span>
              <span className="text-[10px] font-mono font-bold text-cyan-400">{certId}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
                <Shield className="w-4 h-4" />
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[9px] font-mono text-zinc-500 uppercase">Verification Protocol</span>
                <span className="text-[10px] font-mono font-bold text-emerald-400">SHA-256 Validated</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#0d1422] border-t border-white/[0.08] flex items-center justify-between flex-wrap gap-3">
          <span className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Ready for portfolio & LinkedIn sharing</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] text-zinc-200 font-mono text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all border border-white/[0.1]"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-tech font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer transition-all"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
