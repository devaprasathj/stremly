import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { MainLayout } from '../layouts/MainLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { LoadingScreen } from '../components/common/LoadingScreen';

const HomePage = lazy(() => import('../pages/Home/HomePage'));
const MoviesPage = lazy(() => import('../pages/Movies/MoviesPage'));
const TVShowsPage = lazy(() => import('../pages/TVShows/TVShowsPage'));
const MyListPage = lazy(() => import('../pages/MyList/MyListPage'));
const SearchPage = lazy(() => import('../pages/Search/SearchPage'));
const ProfilePage = lazy(() => import('../pages/Profile/ProfilePage'));
const WatchPage = lazy(() => import('../pages/Watch/WatchPage'));
const AdminPage = lazy(() => import('../pages/Admin/AdminPage'));
const LoginPage = lazy(() => import('../pages/Auth/LoginPage'));

const PageLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-streamly-dark">
    <LoadingScreen isLoading />
  </div>
);

interface AppRoutesProps {
  isAuthenticated?: boolean;
}

export const AppRoutes = ({ isAuthenticated = false }: AppRoutesProps) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageLoading />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={isAuthenticated ? <Navigate to="/home" replace /> : <LoginPage />} />
          <Route path="/auth" element={<LoginPage />} />
          <Route
            path="/watch/:id"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Suspense fallback={<PageLoading />}>
                  <WatchPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route element={<MainLayout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/tv-shows" element={<TVShowsPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route
              path="/my-list"
              element={<ProtectedRoute isAuthenticated={isAuthenticated}><MyListPage /></ProtectedRoute>}
            />
            <Route
              path="/profile"
              element={<ProtectedRoute isAuthenticated={isAuthenticated}><ProfilePage /></ProtectedRoute>}
            />
            <Route
              path="/admin"
              element={<ProtectedRoute isAuthenticated={isAuthenticated} requireAdmin><AdminPage /></ProtectedRoute>}
            />
          </Route>
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};
