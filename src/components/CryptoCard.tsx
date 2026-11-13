import { Link } from 'react-router-dom'
import type { Crypto } from '../types/crypto'
import type { Currency } from '../types/api'

interface CryptoCardProps {
  crypto: Crypto
  onToggleFavorite: (id: string) => void
  currency: Currency
}

function CryptoCard({
  crypto,
  onToggleFavorite,
  currency,
}: CryptoCardProps) {
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
        {new Intl.NumberFormat('es-AR', {
          style: 'currency',
          currency: currency.toUpperCase(),
        }).format(crypto.price)}
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
          onClick={() => onToggleFavorite(crypto.id)}
          aria-pressed={crypto.isFavorite}
        >
          {crypto.isFavorite ? '★ Favorita' : '☆ Marcar favorita'}
        </button>
      </div>
    </article>
  )
}

export default CryptoCard