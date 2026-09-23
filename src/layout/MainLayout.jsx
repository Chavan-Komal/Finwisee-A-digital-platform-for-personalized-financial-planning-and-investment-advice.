import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import { Outlet } from 'react-router-dom'
import "../App.css"
import "./MainLayout.css"

// The timed sign-up popup was removed: it covered the page five seconds after
// load. Sign-up is offered by the header, the hero and the closing CTA instead.
// The SignupPrompt component is still in components/SignupPrompt if it's needed.
const MainLayout = () => {
  return (
    <div className="main-layout">
      <Header />
      <main className="">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout
