import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CalculatorPage } from '../features/calculator/CalculatorPage';
import { SettingsPage } from '../features/settings/settings-page';
import { BlogPage } from '../features/blog/BlogPage';
import { BlogPostPage } from '../features/blog/BlogPostPage';

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
