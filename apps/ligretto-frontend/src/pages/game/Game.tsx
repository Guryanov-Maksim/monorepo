import React from 'react'

import { MainLayout } from 'components/layouts/main/MainLayout'
import { GamePage as GamePageContainer } from 'containers/game-page'

export const GamePage: React.FC = () => (
  <MainLayout>
    <GamePageContainer />
  </MainLayout>
)