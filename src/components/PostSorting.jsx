import PropTypes from 'prop-types'
export function PostSorting({ fields = [], orderValue,value, onOrderChange, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
      <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
        <label htmlFor='sortBy'>Sort By</label>
        <select name='sortBy' id='sortBy'
            value={value}
            onChange={(e) => onChange(e.target.value)}
        >
          {fields.map((field) => (
            <option key={field} value={field}>
              {field}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
        <label htmlFor='sortOrder'>Sort Order</label>
        <select
          name='sortOrder'
          id='sortOrder'
          value={orderValue}
          onChange={(e) => onOrderChange(e.target.value)}
        >
          <option value={'ascending'}>ascending</option>
          <option value={'descending'}>descending</option>
        </select>
      </div>
    </div>
  )
}
PostSorting.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.string).isRequired,
}
