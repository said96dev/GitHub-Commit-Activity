import './App.css'
import { GitHubComments } from './components'
function App() {
  return (
    <div className="App">
      <GitHubComments owner={'Aikoyori'} repo={'ProgrammingVTuberLogos'} />
    </div>
  )
}

export default App
