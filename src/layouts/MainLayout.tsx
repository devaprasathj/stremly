import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ThreeScene } from '../components/three/ThreeScene';
import { AIChatbot } from '../components/chatbot/AIChatbot';

export const MainLayout = () => (
  <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
    <ThreeScene />
    <div className="relative z-10">
      <Navbar />
      <main className="relative z-10">
        <Outlet />
      </main>
      <Footer />
      <AIChatbot />
    </div>
  </div>
);
