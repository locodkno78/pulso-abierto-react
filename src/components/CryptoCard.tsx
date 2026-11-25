import { Link } from 'react-router-dom'
import type { Crypto } from '../types/crypto'
import type { Currency } from '../types/api'
import { useFavoritesStore } from '../store/favoritesStore'
import { formatCurrency } from '../utils/formatCurrency'

interface CryptoCardProps {
  crypto: Crypto
  currency: Currency
}

function CryptoCard({ crypto, currency }: CryptoCardProps) {
  const isFavorite = useFavoritesStore((state) =>
    state.favoriteIds.includes(crypto.id),
  )

  const toggleFavorite = useFavoritesStore(
    (state) => state.toggleFavorite,
  )

  return (
    <article className="crypto-card">
      <div className="crypto-card-header">
        <div>
          <h3 className="crypto-name">{crypto.name}</h3>
          <span className="crypto-ticker">
            {crypto.symbol.toUpperCase()}
          </span>
        </div>

        <span className="brand-icon" aria-hidden="true">
          ₿
        </span>
      </div>

      <p className="crypto-price-label">Precio actual</p>

      <p className="crypto-price">
        {formatCurrency(crypto.price, currency)}
      </p>

      <div className="card-actions">
        <Link
          to={`/criptomonedas/${crypto.id}`}
          className="secondary-button"
        >
          Ver detalles
        </Link>

        <button
          type="button"
          className="secondary-button"
          onClick={() => toggleFavorite(crypto.id)}
          aria-pressed={isFavorite}
        >
          {isFavorite ? '★ Favorita' : '☆ Marcar favorita'}
        </button>
      </div>
    </article>
  )
}

export default CryptoCard
