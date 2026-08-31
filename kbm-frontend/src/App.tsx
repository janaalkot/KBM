import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LessonsPage } from './pages/LessonsPage';
import { CreateLessonPage } from './pages/CreateLessonPage';
import { LessonDetailPage } from './pages/LessonDetailPage';
import { ChatbotPage } from './pages/ChatbotPage';
import { LoginPage } from './pages/LoginPage';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-[#050c14] dark:text-slate-100 font-sans antialiased">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<Navigate to="/lessons" replace />} />
              <Route path="/lessons" element={<LessonsPage />} />
              <Route path="/lessons/create" element={<CreateLessonPage />} />
              <Route path="/lessons/:id" element={<LessonDetailPage />} />
              <Route path="/chatbot" element={<ChatbotPage />} />
              <Route path="*" element={<Navigate to="/lessons" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;