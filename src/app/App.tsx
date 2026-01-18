import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CalculatorPage, SettingsPage, BlogPage, BlogPostPage } from '@/features';

const AppLayout: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<CalculatorPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />
    </Routes>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
};
