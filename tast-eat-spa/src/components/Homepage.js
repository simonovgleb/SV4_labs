// src/components/Homepage.js
import React from 'react';
import { Welcome } from './Welcome';
import { MiniInfo } from './MiniInfo';
import { Dishes } from './Dishes';
import { Blog } from './Blog';

export const Homepage = () => {
  return (
    <>
      <Welcome />
      <MiniInfo />
      <Dishes />
      <Blog />
    </>
  );
};