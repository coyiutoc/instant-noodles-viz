import React from 'react';

import LandingPage from './pages/LandingPage/LandingPage';
import NutritionPage from './pages/NutritionPage/NutritionPage';
import MapPage from './pages/MapPage/MapPage';
import ForceLayoutPage from './pages/ForceLayoutPage/ForceLayoutPage';

import './App.css';

function App() {
  return (
    <div>
      <LandingPage />
      <NutritionPage />
      <MapPage />
      <ForceLayoutPage />
    </div>
  );
}

export default App;
