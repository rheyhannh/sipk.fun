'use client'

// #region COMPONENT DEPEDENCY
import { LandingProvider } from '@/component/provider/Landing';
import { Container } from '@/component/landing/Container';
import { Wrapper } from '@/component/landing/Wrapper';
// #endregion

/*
============================== CODE START HERE ==============================
*/

export default function LandingPage() {
  return (
    <LandingProvider>
      <Container>
        <Wrapper>
        </Wrapper>
      </Container>
    </LandingProvider>
  )
}

/*
============================== CODE END HERE ==============================
*/