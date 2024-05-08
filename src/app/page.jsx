'use client'

import { LandingProvider } from '@/component/provider/Landing';
import { Container } from '@/component/landing/Container';
import { Wrapper } from '@/component/landing/Wrapper';

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