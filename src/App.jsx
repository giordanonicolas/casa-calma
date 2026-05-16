import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import CartToast  from './components/CartToast.jsx'
import Home       from './pages/Home.jsx'
import Coleccion  from './pages/Coleccion.jsx'
import Carrito    from './pages/Carrito.jsx'
import Checkout   from './pages/Checkout.jsx'
import Cuenta     from './pages/Cuenta.jsx'

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          {/* Toast global — visible desde cualquier página */}
          <CartToast />

          <Routes>
            <Route path="/"                     element={<Home />} />
            <Route path="/coleccion"            element={<Coleccion />} />
            <Route path="/coleccion/:categoria" element={<Coleccion />} />
            <Route path="/carrito"              element={<Carrito />} />
            <Route path="/checkout"             element={<Checkout />} />
            <Route path="/cuenta"               element={<Cuenta />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}
