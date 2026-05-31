import PropTypes from 'prop-types'
export function PostSorting({ fields = [], orderValue,value, onOrderChange, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="form-group">
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
      <div className="form-group">
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
