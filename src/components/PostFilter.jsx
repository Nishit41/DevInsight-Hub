import PropTypes from 'prop-types'

export function PostFilter({ field, value, onChange }) {
    return (
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label htmlFor={`filter-${field}`}>Filter by {field}</label>
        <input
          type='text'
          name={`filter-${field}`}
          id={`filter-${field}`}
          placeholder="Type username..."
          value={value}
          onChange={(e)=>onChange(e.target.value)}
        />
      </div>
    )
  }
  PostFilter.propTypes = {
    field: PropTypes.string.isRequired,
  }