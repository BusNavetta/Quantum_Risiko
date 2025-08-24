import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Quantum() {
  const navigate = useNavigate();

  return (
    <div className="quantum-bg min-h-screen p-8 relative overflow-hidden">
      {/* Quantum Particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full animate-particle opacity-20"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${15 + Math.random() * 10}s`
          }}
        />
      ))}

      <div className="max-w-4xl mx-auto relative z-10">
        <button 
          onClick={() => navigate('/home')}
          className="mb-8 flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-300"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </button>

        <div className="prose prose-invert max-w-none">
          <div className="bg-black/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-8">
              Keep Calm and Quantum
            </h1>

            <h2 className="text-2xl font-semibold text-blue-400 mb-4">Superposition</h2>
            <p className="text-blue-200 mb-6">
              In quantum mechanics, superposition refers to the ability of a quantum system to exist in multiple states simultaneously. 
              Unlike classical systems where a bit must be either 0 or 1, a quantum bit (qubit) can exist in a combination of both states 
              at once. This principle is fundamental to quantum computing and forms the basis for many quantum algorithms.
            </p>

            <h2 className="text-2xl font-semibold text-blue-400 mb-4">Quantum Measurement</h2>
            <p className="text-blue-200 mb-6">
              The act of measuring a quantum system fundamentally affects its state. When we measure a system in superposition, 
              it "collapses" into one of its possible states according to probability rules. This phenomenon, known as wave function 
              collapse, is a cornerstone of quantum mechanics and has profound implications for quantum computing.
            </p>

            <h2 className="text-2xl font-semibold text-blue-400 mb-4">Quantum Entanglement</h2>
            <p className="text-blue-200 mb-6">
              Entanglement occurs when two or more particles become correlated in such a way that the quantum state of each particle 
              cannot be described independently. Einstein famously called this "spooky action at a distance." In QAJR, entanglement 
              mechanics create strategic depth by linking the states of different territories.
            </p>

            <h2 className="text-2xl font-semibold text-blue-400 mb-4">CHSH Inequality</h2>
            <p className="text-blue-200 mb-6">
              The CHSH (Clauser-Horne-Shimony-Holt) inequality is a mathematical constraint that demonstrates the difference between 
              classical and quantum correlations. Its violation in quantum mechanics proves that quantum entanglement produces stronger 
              correlations than possible in classical physics.
            </p>

            <h2 className="text-2xl font-semibold text-blue-400 mb-4">Grover's Algorithm</h2>
            <p className="text-blue-200 mb-6">
              A quantum algorithm that provides quadratic speedup for searching an unsorted database. In QAJR, principles from 
              Grover's algorithm influence how players can efficiently search for strategic opportunities across the quantum battlefield.
            </p>

            <h2 className="text-2xl font-semibold text-blue-400 mb-4">Probability Amplitude Distribution</h2>
            <p className="text-blue-200 mb-6">
              In quantum mechanics, the probability of finding a particle in a particular state is determined by the square of its 
              probability amplitude. This distribution governs how quantum states evolve and interact, forming the mathematical 
              backbone of quantum mechanics.
            </p>

            <h2 className="text-2xl font-semibold text-blue-400 mb-4">Elitzur–Vaidman Interaction-Free Measurement</h2>
            <p className="text-blue-200 mb-6">
              A fascinating quantum effect where the presence of an object can be detected without directly interacting with it. 
              This principle demonstrates how quantum mechanics allows for the extraction of information about a system without 
              disturbing it in the classical sense.
            </p>

            <h2 className="text-2xl font-semibold text-blue-400 mb-4">Bernstein–Vazirani Algorithm</h2>
            <p className="text-blue-200 mb-6">
              A quantum algorithm that can determine a hidden number in a single query, while classical algorithms require multiple 
              queries. This demonstrates the power of quantum parallelism and interference. In QAJR, similar principles are used 
              to reveal hidden game state information efficiently.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Quantum;