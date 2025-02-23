import './App.css'

function App() {
    return (
        <div className="min-h-screen bg-sea-salt p-8">
            <div className="max-w-xl mx-auto space-y-8">
                <h1 className="text-4xl font-bold text-blue text-center">
                    Tailwind Test
                </h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 rounded-lg bg-columbia-blue shadow-lg">
                        <h2 className="text-xl font-semibold mb-3">Card 1</h2>
                        <p className="text-gray-700">
                            This card uses the columbia-blue background
                        </p>
                    </div>
                    
                    <div className="p-6 rounded-lg bg-tea-green shadow-lg">
                        <h2 className="text-xl font-semibold mb-3">Card 2</h2>
                        <p className="tex-bl">
                            This card uses the tea-green background
                        </p>
                    </div>
                </div>
                
                <button className="w-full bg-blue hover:bg-opacity-90 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                    Test Button
                </button>
            </div>
        </div>
    )
}

export default App