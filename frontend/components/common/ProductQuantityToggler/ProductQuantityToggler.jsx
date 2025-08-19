

import style from './ProductQuantityToggler.module.scss'
function ProductQuantityToggler({handler,quantity}) {
  return (
    <>
                <div className={style.product_quantity_controllers_container}>
                      <button onClick={()=>handler("decrement")} >-</button>
                     <input type="number" value={quantity} min={1} max={100} />
                     <button onClick={()=>handler("increment")} >+</button>
                   </div>
    </>
  )
}

export default ProductQuantityToggler