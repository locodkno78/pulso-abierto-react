import { useState } from 'react'
import { querySchema } from '../schemas/querySchema'
import type { Currency } from '../types/api'

interface QueryControlsProps {
  searchTerm: string
  selectedCurrency: Currency
  onlyFavorites: boolean
  onSearchChange: (value: string) => void
  onCurrencyChange: (value: Currency) => void
  onFavoritesChange: (value: boolean) => void
  onSearch: () => void
}

interface QueryErrors {
  searchTerm?: string
  selectedCurrency?: string
}

function QueryControls({
  searchTerm,
  selectedCurrency,
  onlyFavorites,
  onSearchChange,
  onCurrencyChange,
  onFavoritesChange,
  onSearch,
}: QueryControlsProps) {
  const [errors, setErrors] = useState<QueryErrors>({})

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const result = querySchema.safeParse({
      searchTerm,
      selectedCurrency,
    })

    if (!result.success) {
      const newErrors: QueryErrors = {}

      result.error.issues.forEach((issue) => {
        const field = issue.path[0]

        if (field === 'searchTerm') {
          newErrors.searchTerm = issue.message
        }

        if (field === 'selectedCurrency') {
          newErrors.selectedCurrency = issue.message
        }
      })

      setErrors(newErrors)
      return
    }

    setErrors({})
    onSearch()
  }

  function handleSearchChange(value: string) {
    onSearchChange(value)
    setErrors((previousErrors) => ({
      ...previousErrors,
      searchTerm: undefined,
    }))
  }

  function handleCurrencyChange(value: Currency) {
    onCurrencyChange(value)
    setErrors((previousErrors) => ({
      ...previousErrors,
      selectedCurrency: undefined,
    }))
  }

  return (
    <form className="query-panel query-controls" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="crypto-search">
          Buscar criptomoneda
        </label>

        <input
          id="crypto-search"
          type="text"
          placeholder="Ejemplo: Bitcoin"
          value={searchTerm}
          onChange={(event) => handleSearchChange(event.target.value)}
          aria-invalid={Boolean(errors.searchTerm)}
          aria-describedby={
            errors.searchTerm ? 'crypto-search-error' : undefined
          }
        />

        {errors.searchTerm && (
          <p id="crypto-search-error" className="field-error" role="alert">
            {errors.searchTerm}
          </p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="currency-select">
          Moneda de cotización
        </label>

        <select
          id="currency-select"
          value={selectedCurrency}
          onChange={(event) => {
            const value = event.target.value
            if (value === 'usd' || value === 'eur' || value === 'ars') {
              handleCurrencyChange(value)
            }
          }}
          aria-invalid={Boolean(errors.selectedCurrency)}
          aria-describedby={
            errors.selectedCurrency ? 'currency-select-error' : undefined
          }
        >
          <option value="usd">Dólar estadounidense (USD)</option>
          <option value="eur">Euro (EUR)</option>
          <option value="ars">Peso argentino (ARS)</option>
        </select>

        {errors.selectedCurrency && (
          <p id="currency-select-error" className="field-error" role="alert">
            {errors.selectedCurrency}
          </p>
        )}
      </div>

      <div className="form-group">
        <label className="checkbox-label" htmlFor="favorites-filter">
          <input
            id="favorites-filter"
            type="checkbox"
            checked={onlyFavorites}
            onChange={(event) =>
              onFavoritesChange(event.target.checked)
            }
          />
          Mostrar solo favoritas
        </label>
      </div>

      <button type="submit" className="primary-button">
        Buscar
      </button>
    </form>
  )
}

export default QueryControls