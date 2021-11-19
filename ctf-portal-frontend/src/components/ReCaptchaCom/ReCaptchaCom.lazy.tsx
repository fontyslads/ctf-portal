import React, { lazy, Suspense } from 'react';

const LazyReCaptchaCom = lazy(() => import('./ReCaptchaCom'));

const ReCaptchaCom = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyReCaptchaCom {...props} />
  </Suspense>
);

export default ReCaptchaCom;
