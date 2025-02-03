import { useState, useEffect } from 'react'
import { ContextProviderComponent, SiteContext } from '../context/mainContext'
import { FaShoppingCart, FaCircle } from 'react-icons/fa';
import Link from "next/link"
import { colors } from '../theme'
const { primary } = colors

function CartLink(props) {
  const [renderClientSideComponent, setRenderClientSideComponent] = useState(false)
  useEffect(() => {
    setRenderClientSideComponent(true)
  }, [])
  let { context: { numberOfItemsInCart = 0 }} = props
  return (
    (<div>
      <div>
        <Link href="/cart" aria-label="cart" className="relative">
          <FaShoppingCart className="w-6 h-6 text-zinc-800 hover:text-gray-700 transition-colors" />
          {renderClientSideComponent && numberOfItemsInCart > Number(0) && (
            <div className="absolute -top-7 -right-8">
              <FaCircle color={primary} size={12} suppressHydrateWarning />
              <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs text-zinc-800">
                {numberOfItemsInCart}
              </span>
            </div>
          )}
        </Link>
      </div>
    </div>)
  );
}

function CartLinkWithContext(props) {
  return (
    <ContextProviderComponent>
      <SiteContext.Consumer>
        {
          context => <CartLink {...props} context={context} />
        }
      </SiteContext.Consumer>
    </ContextProviderComponent>
  )
}

export default CartLinkWithContext