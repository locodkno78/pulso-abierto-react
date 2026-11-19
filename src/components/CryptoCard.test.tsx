// @vitest-environment jsdom

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

import CryptoCard from './CryptoCard'
import { useFavoritesStore } from '../store/favoritesStore'

const bitcoin = {
  id: 'bitcoin',
  name: 'Bitcoin',
  symbol: 'btc',
  price: 95000,
}

function renderCryptoCard() {
  return render(
    <MemoryRouter>
      <CryptoCard crypto={bitcoin} currency="usd" />
    </MemoryRouter>,
  )
}

describe('CryptoCard', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ favoriteIds: [] })
    localStorage.clear()
  })

  it('permite marcar una criptomoneda como favorita', async () => {
    const user = userEvent.setup()

    renderCryptoCard()

    const favoriteButton = screen.getByRole('button', {
      name: '☆ Marcar favorita',
    })

    await user.click(favoriteButton)

    expect(
      screen.getByRole('button', { name: '★ Favorita' }),
    ).toHaveAttribute('aria-pressed', 'true')

    expect(
      useFavoritesStore.getState().favoriteIds,
    ).toContain('bitcoin')
  })

  it('permite quitar una criptomoneda de favoritos', async () => {
    const user = userEvent.setup()

    useFavoritesStore.setState({
      favoriteIds: ['bitcoin'],
    })

    renderCryptoCard()

    const favoriteButton = screen.getByRole('button', {
      name: '★ Favorita',
    })

    await user.click(favoriteButton)

    expect(
      screen.getByRole('button', {
        name: '☆ Marcar favorita',
      }),
    ).toHaveAttribute('aria-pressed', 'false')

    expect(
      useFavoritesStore.getState().favoriteIds,
    ).not.toContain('bitcoin')
  })
})
