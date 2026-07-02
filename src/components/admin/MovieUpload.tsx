import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUpload, FiImage, FiVideo, FiFilm,
  FiPlus, FiX, FiCheck, FiAlertCircle,
} from 'react-icons/fi';
import { GlassCard } from '../common/GlassCard';
import { GENRES, LANGUAGES, MATURITY_RATINGS } from '../../utils/constants';

interface MovieUploadProps {
  onComplete?: () => void;
}

export const MovieUpload = ({ onComplete }: MovieUploadProps) => {
  const [step, setStep] = useState<'details' | 'media' | 'preview'>('details');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [backdropPreview, setBackdropPreview] = useState<string | null>(null);
  const posterRef = useRef<HTMLInputElement>(null);
  const backdropRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const trailerRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    year: new Date().getFullYear(),
    duration: '',
    rating: 5,
    genres: [] as string[],
    language: '',
    maturityRating: '',
    director: '',
    cast: '',
    category: 'movie' as 'movie' | 'tvshow',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleGenreToggle = (genre: string) => {
    setForm((prev) => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter((g) => g !== genre)
        : [...prev.genres, genre],
    }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    if (form.genres.length === 0) errs.genres = 'Select at least one genre';
    if (!form.language) errs.language = 'Language is required';
    if (!form.maturityRating) errs.maturityRating = 'Maturity rating is required';
    if (!form.duration) errs.duration = 'Duration is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 'details' && validate()) setStep('media');
    else if (step === 'media') setStep('preview');
  };

  const handleUpload = () => {
    setIsUploading(true);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          onComplete?.();
          return 100;
        }
        return prev + 10;
      });
    }, 400);
  };

  const handlePosterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPosterPreview(URL.createObjectURL(file));
  };

  const handleBackdropUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setBackdropPreview(URL.createObjectURL(file));
  };

  return (
    <GlassCard className="p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        {(['details', 'media', 'preview'] as const).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
              step === s
                ? 'bg-streamly-red text-white'
                : ['details', 'media'].includes(step) && i < ['details', 'media', 'preview'].indexOf(step)
                  ? 'bg-green-500/20 text-green-500'
                  : 'bg-white/10 text-streamly-gray'
            }`}>
              {['details', 'media'].includes(step) && i < ['details', 'media', 'preview'].indexOf(step) ? (
                <FiCheck size={16} />
              ) : (
                i + 1
              )}
            </div>
            <span className={`text-sm capitalize hidden md:inline ${step === s ? 'text-white' : 'text-streamly-gray'}`}>
              {s}
            </span>
            {i < 2 && <div className={`w-8 h-0.5 ${['details', 'media'].includes(step) && i < ['details', 'media', 'preview'].indexOf(step) ? 'bg-green-500' : 'bg-white/10'}`} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 'details' && (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-streamly-gray uppercase mb-1.5 block">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-streamly-gray focus:outline-none focus:border-streamly-red/50"
                  placeholder="Movie title"
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold text-streamly-gray uppercase mb-1.5 block">Year</label>
                <input
                  type="number"
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-streamly-red/50"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-streamly-gray uppercase mb-1.5 block">Description *</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-streamly-gray focus:outline-none focus:border-streamly-red/50 resize-none"
                placeholder="Movie description"
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-streamly-gray uppercase mb-1.5 block">Duration *</label>
                <input
                  type="text"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-streamly-gray focus:outline-none focus:border-streamly-red/50"
                  placeholder="2h 28m"
                />
                {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold text-streamly-gray uppercase mb-1.5 block">Rating (0-10)</label>
                <input
                  type="number"
                  min={0}
                  max={10}
                  step={0.1}
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: parseFloat(e.target.value) })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-streamly-red/50"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-streamly-gray uppercase mb-1.5 block">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as 'movie' | 'tvshow' })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-streamly-red/50"
                >
                  <option value="movie">Movie</option>
                  <option value="tvshow">TV Show</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-streamly-gray uppercase mb-1.5 block">Language *</label>
                <select
                  value={form.language}
                  onChange={(e) => setForm({ ...form, language: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-streamly-red/50"
                >
                  <option value="">Select language</option>
                  {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
                {errors.language && <p className="text-red-500 text-xs mt-1">{errors.language}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold text-streamly-gray uppercase mb-1.5 block">Maturity Rating *</label>
                <select
                  value={form.maturityRating}
                  onChange={(e) => setForm({ ...form, maturityRating: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-streamly-red/50"
                >
                  <option value="">Select rating</option>
                  {MATURITY_RATINGS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
                {errors.maturityRating && <p className="text-red-500 text-xs mt-1">{errors.maturityRating}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-streamly-gray uppercase mb-1.5 block">Director</label>
                <input
                  type="text"
                  value={form.director}
                  onChange={(e) => setForm({ ...form, director: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-streamly-gray focus:outline-none focus:border-streamly-red/50"
                  placeholder="Director name"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-streamly-gray uppercase mb-1.5 block">Cast (comma separated)</label>
                <input
                  type="text"
                  value={form.cast}
                  onChange={(e) => setForm({ ...form, cast: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-streamly-gray focus:outline-none focus:border-streamly-red/50"
                  placeholder="Actor 1, Actor 2, Actor 3"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-streamly-gray uppercase mb-2 block">Genres *</label>
              <div className="flex flex-wrap gap-2">
                {GENRES.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => handleGenreToggle(genre)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                      form.genres.includes(genre)
                        ? 'bg-streamly-red border-streamly-red text-white'
                        : 'bg-white/5 border-white/10 text-streamly-gray-light hover:bg-white/10'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
              {errors.genres && <p className="text-red-500 text-xs mt-1">{errors.genres}</p>}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNext}
              className="w-full py-3 bg-streamly-red hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              Next: Upload Media
            </motion.button>
          </motion.div>
        )}

        {step === 'media' && (
          <motion.div
            key="media"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                onClick={() => posterRef.current?.click()}
                className="relative h-48 rounded-xl border-2 border-dashed border-white/10 hover:border-streamly-red/50 transition-colors cursor-pointer flex flex-col items-center justify-center bg-white/5"
              >
                {posterPreview ? (
                  <>
                    <img src={posterPreview} alt="Poster" className="w-full h-full object-cover rounded-xl" />
                    <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <FiUpload size={24} className="text-white" />
                    </div>
                  </>
                ) : (
                  <>
                    <FiImage size={32} className="text-streamly-gray mb-2" />
                    <p className="text-sm text-streamly-gray">Upload Poster</p>
                    <p className="text-xs text-streamly-gray/60">Recommended: 500x750</p>
                  </>
                )}
                <input ref={posterRef} type="file" accept="image/*" onChange={handlePosterUpload} className="hidden" />
              </div>

              <div
                onClick={() => backdropRef.current?.click()}
                className="relative h-48 rounded-xl border-2 border-dashed border-white/10 hover:border-streamly-red/50 transition-colors cursor-pointer flex flex-col items-center justify-center bg-white/5"
              >
                {backdropPreview ? (
                  <>
                    <img src={backdropPreview} alt="Backdrop" className="w-full h-full object-cover rounded-xl" />
                    <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <FiUpload size={24} className="text-white" />
                    </div>
                  </>
                ) : (
                  <>
                    <FiImage size={32} className="text-streamly-gray mb-2" />
                    <p className="text-sm text-streamly-gray">Upload Backdrop</p>
                    <p className="text-xs text-streamly-gray/60">Recommended: 1920x1080</p>
                  </>
                )}
                <input ref={backdropRef} type="file" accept="image/*" onChange={handleBackdropUpload} className="hidden" />
              </div>
            </div>

            <div
              onClick={() => trailerRef.current?.click()}
              className="relative h-32 rounded-xl border-2 border-dashed border-white/10 hover:border-streamly-red/50 transition-colors cursor-pointer flex flex-col items-center justify-center bg-white/5"
            >
              <FiVideo size={28} className="text-streamly-gray mb-2" />
              <p className="text-sm text-streamly-gray">Upload Trailer Video</p>
              <p className="text-xs text-streamly-gray/60">MP4, WebM, or YouTube URL</p>
              <input ref={trailerRef} type="file" accept="video/*" className="hidden" />
            </div>

            <div
              onClick={() => videoRef.current?.click()}
              className="relative h-32 rounded-xl border-2 border-dashed border-white/10 hover:border-streamly-red/50 transition-colors cursor-pointer flex flex-col items-center justify-center bg-white/5"
            >
              <FiFilm size={28} className="text-streamly-gray mb-2" />
              <p className="text-sm text-streamly-gray">Upload Full Video</p>
              <p className="text-xs text-streamly-gray/60">MP4, WebM format</p>
              <input ref={videoRef} type="file" accept="video/*" className="hidden" />
            </div>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep('details')}
                className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg font-medium transition-colors"
              >
                Back
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                className="flex-1 py-3 bg-streamly-red hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Next: Preview
              </motion.button>
            </div>
          </motion.div>
        )}

        {step === 'preview' && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="relative rounded-xl overflow-hidden bg-[#14141a] aspect-video max-w-lg mx-auto">
              {backdropPreview ? (
                <img src={backdropPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FiFilm size={48} className="text-streamly-gray" />
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80">
                <h3 className="text-lg font-bold text-white">{form.title || 'Untitled'}</h3>
                <div className="flex items-center gap-2 text-xs text-streamly-gray-light">
                  <span className="text-green-500">{form.rating}/10</span>
                  <span>{form.year}</span>
                  <span className="border border-white/30 px-1">{form.maturityRating}</span>
                  <span>{form.duration}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-streamly-gray">Title</span>
                <span className="text-white">{form.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-streamly-gray">Category</span>
                <span className="text-white capitalize">{form.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-streamly-gray">Genres</span>
                <span className="text-white">{form.genres.join(', ') || 'None'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-streamly-gray">Language</span>
                <span className="text-white">{form.language || 'Not set'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-streamly-gray">Director</span>
                <span className="text-white">{form.director || 'Not set'}</span>
              </div>
            </div>

            {isUploading ? (
              <div className="space-y-3">
                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    className="h-full bg-gradient-to-r from-streamly-red to-red-700 rounded-full"
                  />
                </div>
                <p className="text-center text-sm text-streamly-gray">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            ) : (
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep('media')}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg font-medium transition-colors"
                >
                  Back
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUpload}
                  className="flex-1 py-3 bg-streamly-red hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <FiUpload size={16} />
                  Upload Movie
                </motion.button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
};
