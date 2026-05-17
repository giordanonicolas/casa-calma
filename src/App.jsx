import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import CartToast             from './components/CartToast.jsx'
import Home                  from './pages/Home.jsx'
import Coleccion             from './pages/Coleccion.jsx'
import Carrito               from './pages/Carrito.jsx'
import Checkout              from './pages/Checkout.jsx'
import Cuenta                from './pages/Cuenta.jsx'
import Nosotros              from './pages/Nosotros.jsx'
import Contacto              from './pages/Contacto.jsx'
import CuidadoDelTextil      from './pages/CuidadoDelTextil.jsx'
import EnviosYDevoluciones   from './pages/EnviosYDevoluciones.jsx'
import Admin                 from './pages/Admin.jsx'

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          {/* Toast global — visible desde cualquier página */}
          <CartToast />

          <Routes>
            <Route path="/"                        element={<Home />} />
            <Route path="/coleccion"               element={<Coleccion />} />
            <Route path="/coleccion/:categoria"    element={<Coleccion />} />
            <Route path="/carrito"                 element={<Carrito />} />
            <Route path="/checkout"                element={<Checkout />} />
            <Route path="/cuenta"                  element={<Cuenta />} />
            <Route path="/nosotros"                element={<Nosotros />} />
            <Route path="/contacto"                element={<Contacto />} />
            <Route path="/cuidado-del-textil"      element={<CuidadoDelTextil />} />
            <Route path="/envios-y-devoluciones"   element={<EnviosYDevoluciones />} />
            <Route path="/admin"                   element={<Admin />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}
