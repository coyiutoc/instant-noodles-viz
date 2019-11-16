import React from 'react';

import LandingPage from './pages/LandingPage/LandingPage';
import NutritionPage from './pages/NutritionPage/NutritionPage';
import MapPage from './pages/MapPage/MapPage';

import './App.css';

function App() {
  return (
    <div>
      <LandingPage />
      <NutritionPage />
      <MapPage />
    </div>
  );
}

export default App;
