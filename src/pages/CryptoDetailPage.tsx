import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { initialCryptos } from '../data/cryptos'
import { fetchCryptos } from '../services/cryptoService'
import { useFavoritesStore } from '../store/favoritesStore'
import { formatCurrency } from '../utils/formatCurrency'
import type { Currency } from '../types/api'
import type { Crypto } from '../types/crypto'

function CryptoDetailPage() {
  const { id } = useParams()
  const location = useLocation()
  const locationCurrency = (
    location.state as { currency?: Currency } | null
  )?.currency
  const currency: Currency =
    locationCurrency === 'eur' || locationCurrency === 'ars'
      ? locationCurrency
      : 'usd'

  const [crypto, setCrypto] = useState<Crypto | null>(() =>
    initialCryptos.find((item) => item.id === id) ?? null,
  )
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadCrypto() {
      setLoading(true)
      setErrorMessage('')

      try {
        const cryptos = await fetchCryptos(currency, controller.signal)
        const currentCrypto = cryptos.find((item) => item.id === id)

        if (currentCrypto) {
          setCrypto(currentCrypto)
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return
        }

        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'No se pudo obtener la cotización actual.',
        )
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadCrypto()

    return () => {
      controller.abort()
    }
  }, [currency, id])

  const isFavorite = useFavoritesStore((state) =>
    crypto ? state.favoriteIds.includes(crypto.id) : false,
  )

  const toggleFavorite = useFavoritesStore(
    (state) => state.toggleFavorite,
  )

  if (!crypto) {
    return (
      <main className="container main-content">
        <section className="query-panel">
          <h1>Criptomoneda no encontrada</h1>
          <p>
            No encontramos una criptomoneda con el identificador solicitado.
          </p>

          <Link to="/" className="secondary-button">
            Volver a cotizaciones
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main className="container main-content">
      <section className="intro">
        <p className="eyebrow">DETALLE DE COTIZACIÓN</p>
        <h1>{crypto.name}</h1>
        <p className="intro-text">
          Información de la criptomoneda seleccionada.
        </p>
      </section>

      <section className="query-panel">
        <h2>{crypto.name}</h2>

        <p>
          <strong>Identificador:</strong> {crypto.id}
        </p>

        <p>
          <strong>Símbolo:</strong> {crypto.symbol.toUpperCase()}
        </p>

        <p>
          <strong>Precio:</strong>{' '}
          {loading
            ? 'Consultando cotización actual...'
            : formatCurrency(crypto.price, currency)}
        </p>

        {errorMessage && (
          <p role="alert" className="field-error">
            {errorMessage}
          </p>
        )}

        <p>
          <strong>Favorita:</strong>{' '}
          {isFavorite ? 'Sí' : 'No'}
        </p>

        <button
          type="button"
          className="secondary-button"
          onClick={() => toggleFavorite(crypto.id)}
          aria-pressed={isFavorite}
        >
          {isFavorite ? '★ Quitar de favoritos' : '☆ Agregar a favoritos'}
        </button>

        <Link to="/" className="secondary-button">
          Volver a cotizaciones
        </Link>
      </section>
    </main>
  )
}

export default CryptoDetailPage
