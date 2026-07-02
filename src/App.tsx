import { useEffect, useRef, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Lenis from 'lenis';
import { useAuth } from './hooks/useAuth';
import { MainLayout } from './layouts/MainLayout';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { IntroScreen } from './components/common/IntroScreen';
import { LoadingScreen } from './components/common/LoadingScreen';

const LoginPage = lazy(() => import('./pages/Auth/LoginPage'));
const HomePage = lazy(() => import('./pages/Home/HomePage'));
const MoviesPage = lazy(() => import('./pages/Movies/MoviesPage'));
const TVShowsPage = lazy(() => import('./pages/TVShows/TVShowsPage'));
const MyListPage = lazy(() => import('./pages/MyList/MyListPage'));
const SearchPage = lazy(() => import('./pages/Search/SearchPage'));
const ProfilePage = lazy(() => import('./pages/Profile/ProfilePage'));
const WatchPage = lazy(() => import('./pages/Watch/WatchPage'));
const AdminPage = lazy(() => import('./pages/Admin/AdminPage'));

const PageLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-streamly-dark">
    <LoadingScreen isLoading />
  </div>
);

const App = () => {
  const [introFinished, setIntroFinished] = useState(false);
  const { user, loading } = useAuth();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const seen = localStorage.getItem('streamly_intro_seen');
    if (seen === 'true') setIntroFinished(true);
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });
    lenisRef.current = lenis;
    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  if (loading) return <PageLoading />;
  if (!introFinished) return <IntroScreen onComplete={() => { localStorage.setItem('streamly_intro_seen', 'true'); setIntroFinished(true); }} />;

  return (
    <Suspense fallback={<PageLoading />}>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />} />
        <Route path="/login" element={user ? <Navigate to="/home" replace /> : <LoginPage />} />
        <Route path="/signup" element={user ? <Navigate to="/home" replace /> : <LoginPage />} />
        <Route path="/auth" element={user ? <Navigate to="/home" replace /> : <LoginPage />} />

        <Route path="/watch/:id" element={
          <ProtectedRoute><Suspense fallback={<PageLoading />}><WatchPage /></Suspense></ProtectedRoute>
        } />

        <Route element={<MainLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/tv-shows" element={<TVShowsPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/my-list" element={<ProtectedRoute><MyListPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminPage /></ProtectedRoute>} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default App;
