import React from 'react'

const ProductListHeader = ({ title, onEdit, onAdd }) => (
  <div>
    <h3>{title}</h3>
    <button onClick={onEdit}>
      <i>Edit</i>
    </button>
    <button onClick={onAdd}>
      <i>Add New</i>
    </button>
  </div>
)

export default ProductListHeader
