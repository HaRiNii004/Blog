import { createRoot } from 'react-dom/client'
import './index.css'
import Write from './pages/write/write.jsx'
import ViewPosts from './pages/write/viewposts/viewposts.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<ViewPosts />} />
      <Route path="/create-post" element={<Write />} />
      <Route path="/edit/:id" element={<Write />} />
    </Routes>
  </BrowserRouter>
)
