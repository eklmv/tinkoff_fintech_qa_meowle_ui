import React from 'react';
import { Header } from '../../common/components/header';
import { NoResults } from '../../common/components/no-results/no-result';

export function NotFoundPage() {
  return (
    <>
      <Header />
      <NoResults text="Упс, ничего не найдено" />
    </>
  );
}
