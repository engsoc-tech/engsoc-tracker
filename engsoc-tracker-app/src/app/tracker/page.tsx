"use client"
import React, {useState} from 'react'

const Tracker = () => {

    const [result, setResults] = useState(null) 

    async function handleOnClick() {
        const results = await fetch("/api/scraper", {
            method: "POST",
            body: JSON.stringify({
                siteUrl: "https://www.gradcracker.com/search/all-disciplines/engineering-work-placements-internships"
    
            })
        }).then(r => r.json())
        setResults(results)
    }

  return (
    <main className="hero bg-base-200 min-h-screen">
    <div className="hero-content text-center">
      <div className="max-w-xl">
        <h1 className="text-5xl font-bold mb-8">Let&apos;s scrape something!</h1>
        <p className="mb-2">
          Click the button to test out your new scraper.
        </p>
        <p className="text-sm text-zinc-700 italic mb-6">
          Psst. Make sure you <a className="text-blue-500 underline" href="https://spacejelly.dev" target="_blank">build it first</a>!
        </p>
        <p className="mb-6">
          <button className="btn btn-primary" onClick={handleOnClick}>Get Started</button>
        </p>
        {result && (
          <div className="grid">
            <pre className="bg-zinc-200 text-left py-4 px-5 rounded overflow-x-scroll text-black">
              <code>{JSON.stringify(result, undefined, 2)}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  </main>
  )
}

export default Tracker