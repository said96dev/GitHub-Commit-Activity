import './App.css'
import { GitHubComments } from './components'
function App() {
  return (
    <div className="App bg-[#2b2b2b] min-h-[100vh] overflow-hidden ">
      <h1 className="bg-[#3b3b3b] text-3xl text-center py-4 mb-4 text-white">
        GitHub Commit Activity
      </h1>
      <GitHubComments owner={'Aikoyori'} repo={'ProgrammingVTuberLogos'} />
    </div>
  )
}

export default App
